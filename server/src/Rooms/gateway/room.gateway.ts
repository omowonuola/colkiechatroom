import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { UserRepository } from '../../user/user.repository';
import { UserI } from '../../user/model/user.interface';
import { OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { RoomsService } from '../service/room-service/rooms.service';
import { RoomI } from '../model/rooms/rooms.interface';
import { PageI } from '../model/page.interface';
import { ConnectedUserService } from '../service/connected-user/connected-user.service';
import { ConnectedUserI } from '../model/connected-user/connected-user.interface';
import { MessageService } from '../service/message/message.service';
import { JoinedRoomService } from '../service/joined-room/joined-room.service';
import { MessageI } from '../model/message/message.interface';
import { JoinedRoomI } from '../model/joined-room/joined-room.interface';
import { AuthService } from 'src/auth/service/auth.service';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: [
      'https://hoppscotch.io',
      'http://localhost:8080',
      'http://localhost:3000',
    ],
  },
})
export class RoomGateway implements OnGatewayConnection, OnGatewayDisconnect {
  logger = new Logger();
  @WebSocketServer()
  server: Server;

  title: string[] = [];

  constructor(
    private userRepository: UserRepository,
    private roomRepository: RoomsService,
    private connectedUserRepository: ConnectedUserService,
    private joinedRoomRepository: JoinedRoomService,
    private messageRepository: MessageService,
    private authService: AuthService,
  ) {}

  async handleConnection(socket: Socket) {
    try {
      const decodeToken = await this.authService.verifyJwt(
        socket.handshake.headers.authorization,
      );
      const user: UserI = await this.userRepository.getOne(decodeToken.user.id);
      if (!user) {
        return this.disconnect(socket);
      } else {
        // socket.data.user = user;
        const rooms = await this.roomRepository.getRoomsForUser(user.id, {
          page: 1,
          limit: 10,
        });
        // save connection to DB
        await this.connectedUserRepository.create({
          socketId: socket.id,
          user,
        });
        // only emit rooms to the specific connected client
        return this.server.to(socket.id).emit('rooms', rooms);
      }
    } catch (error) {
      return this.disconnect(socket);
    }
  }

  async handleDisconnect(socket: Socket) {
    // remove connection from DB
    await this.connectedUserRepository.deleteBySocketId(socket.id);
    socket.disconnect();
  }

  private disconnect(socket: Socket) {
    socket.emit('Error', new UnauthorizedException());
    socket.disconnect();
  }

  private async decodeToken(socket: Socket) {
    const connect = await this.authService.verifyJwt(
      socket.handshake.headers.authorization,
    );
    return connect.user;
  }

  @SubscribeMessage('createRoom')
  async onCreateRoom(socket: Socket, room: RoomI) {
    const getUser = await this.decodeToken(socket);
    try {
      const createdRoom: RoomI = await this.roomRepository.createRoom(
        room,
        getUser,
      );

      for (const user of createdRoom.users) {
        const connections: ConnectedUserI[] =
          await this.connectedUserRepository.findByUser(user);
        const rooms = await this.roomRepository.getRoomsForUser(user.id, {
          page: 1,
          limit: 10,
        });
        for (const connection of connections) {
          await this.server.to(connection.socketId).emit('rooms', rooms);
        }
      }
    } catch (error) {
      this.logger.log(error);
    }
  }

  @SubscribeMessage('paginateRooms')
  async onPaginateRoom(socket: Socket, page: PageI) {
    page.limit = page.limit > 100 ? 100 : page.limit;
    const rooms = await this.roomRepository.getRoomsForUser(
      socket.data.user.id,
      { page: 1, limit: 10 },
    );
    return this.server.to(socket.id).emit('rooms', rooms);
  }

  @SubscribeMessage('joinRoom')
  async onJoinRoom(socket: Socket, room: RoomI) {
    const getUser = await this.decodeToken(socket);
    try {
      const messages = await this.messageRepository.findMessagesForRoom(room, {
        limit: 10,
        page: 1,
      });

      // Save Connection to Room
      await this.joinedRoomRepository.create({
        socketId: socket.id,
        user: getUser,
        room,
      });

      // send last message from Room to User
      await this.server.to(socket.id).emit('messages', messages);
    } catch (error) {
      this.logger.log(error);
    }
  }

  @SubscribeMessage('leaveRoom')
  async onLeaveRoom(socket: Socket) {
    // remove connection from Joined Rooms
    await this.joinedRoomRepository.deleteBySocketId(socket.id);
  }

  @SubscribeMessage('addMessage')
  async onAddMessage(socket: Socket, message: MessageI) {
    const getUser = await this.decodeToken(socket);
    try {
      const createdMessage: MessageI = await this.messageRepository.create({
        ...message,
        user: getUser,
      });
      const room: RoomI = await this.roomRepository.getRoom(
        createdMessage.room.id,
      );
      const joinedUsers: JoinedRoomI[] =
        await this.joinedRoomRepository.findByRoom(room);
      //   send message to all joined users(currently-online) in the room
      for (const user of joinedUsers) {
        await this.server
          .to(user.socketId)
          .emit('messageAdded', createdMessage);
      }
    } catch (error) {
      this.logger.log(error);
    }
  }
}
