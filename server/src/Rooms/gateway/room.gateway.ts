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
import { UnauthorizedException } from '@nestjs/common';
import { RoomsRepository } from '../rooms.repository';
import { RoomI } from '../model/rooms/rooms.interface';

@WebSocketGateway({
  cors: { origin: ['https://hoppscotch.io', 'http://localhost:8080'] },
})
export class RoomGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  title: string[] = [];

  constructor(
    private userRepository: UserRepository,
    private roomRepository: RoomsRepository,
  ) {}

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

        // only emit rooms to the specific connected client
        return this.server.to(socket.id).emit('rooms', rooms);
      }
    } catch (error) {
      return this.disconnect(socket);
    }
  }

  handleDisconnect(socket: Socket) {
    socket.disconnect();
  }

  private disconnect(socket: Socket) {
    socket.emit('Error', new UnauthorizedException());
    socket.disconnect();
  }

  @SubscribeMessage('createRoom')
  async onCreateRoom(socket: Socket, room: RoomI): Promise<RoomI> {
    return this.roomRepository.createRoom(room, socket.data.user);
  }
}
