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
import { MessageService } from '../service/message/rooms.service';
import { JoinedRoomService } from '../service/joined-room/joined-room.service';
import { MessageI } from '../model/message/message.interface';
import { JoinedRoomI } from '../model/joined-room/joined-room.interface';

@WebSocketGateway({
  cors: { origin: ['https://hoppscotch.io', 'http://localhost:8080'] },
})
export class RoomGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{
  @WebSocketServer()
  server: Server;

  title: string[] = [];

  constructor(
    private userRepository: UserRepository,
    private roomRepository: RoomsService,
    private connectedUserRepository: ConnectedUserService,
    private joinedRoomRepository: JoinedRoomService,
    private messageRepository: MessageService,
  ) {}

  async onModuleInit() {
    await this.connectedUserRepository.deleteAll();
    await this.joinedRoomRepository.deleteAll();
  }

  async handleConnection(socket: Socket) {
    try {
      const decodeToken = await this.userRepository.verifyJwt(
        socket.handshake.auth.token,
      );
      const user: UserI = await this.userRepository.getOne(
        decodeToken.payload.id,
      );
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

  @SubscribeMessage('createRoom')
  async onCreateRoom(socket: Socket, room: RoomI) {
    const createdRoom: RoomI = await this.roomRepository.createRoom(
      room,
      socket.data.user,
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
    const messages = await this.messageRepository.findMessagesForRoom(room, {
      limit: 10,
      page: 1,
    });

    // Save Connection to Room
    await this.joinedRoomRepository.create({
      socketId: socket.id,
      user: socket.data.user,
      room,
    });

    // send last message from Room to User
    await this.server.to(socket.id).emit('messages', messages);
  }

  @SubscribeMessage('leaveRoom')
  async onLeaveRoom(socket: Socket) {
    // remove connection from Joined Rooms
    await this.joinedRoomRepository.deleteBySocketId(socket.id);
  }

  @SubscribeMessage('addMessage')
  async onAddMessage(socket: Socket, message: MessageI) {
    const createdMessage: MessageI = await this.messageRepository.create({
      ...message,
      user: socket.data.user,
    });
    const room: RoomI = await this.roomRepository.getRoom(
      createdMessage.room.id,
    );
    const joinedUsers: JoinedRoomI[] =
      await this.joinedRoomRepository.findByRoom(room);

    //   send message to all joined users(currently-online) in the room
    for (const user of joinedUsers) {
      await this.server.to(user.socketId).emit('message', createdMessage);
    }
  }
}
