import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { UserRepository } from 'src/user/user.repository';
import { UserI } from 'src/user/model/user.interface';
import { OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { RoomsService } from '../service/room-service/rooms.service';
import { RoomI } from '../model/rooms/rooms.interface';
import { PageI } from '../model/page.interface';
import { ConnectedUserService } from '../service/connected-user/connected-user.service';
import { ConnectedUserI } from '../model/connected-user/connected-user.interface';

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
  ) {}

  async onModuleInit() {
    await this.connectedUserRepository.deleteAll();
  }

  async handleConnection(socket: Socket) {
    try {
      const decodeToken = await this.userRepository.verifyJwt(
        socket.handshake.headers.authorization,
      );
      console.log(decodeToken, 'here');
      const user: UserI = await this.userRepository.getOne(decodeToken.user.id);
      if (!user) {
        return this.disconnect(socket);
      } else {
        socket.data.user = user;
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
}
