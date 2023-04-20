import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { UserRepository } from 'src/user/user.repository';
import { JwtService } from '@nestjs/jwt';
import { UserI } from 'src/user/model/user.interface';
import { UnauthorizedException } from '@nestjs/common';

@WebSocketGateway({
  cors: { origin: ['https://hoppscotch.io', 'http://localhost:8080'] },
})
export class RoomGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  title: string[] = [];

  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async handleConnection(socket: Socket) {
    try {
      const decodeToken = await this.jwtService.verifyAsync(
        socket.handshake.headers.authorization,
      );
      console.log(decodeToken, 'here');
      const user: UserI = await this.userRepository.getOne(decodeToken.user.id);

      if (!user) {
        return this.disconnect(socket);
      } else {
        this.title.push('Value ' + Math.random().toString());
        this.server.emit('message', this.title);
      }
    } catch (error) {
      return this.disconnect(socket);
    }
    console.log('On Connect');
  }

  handleDisconnect(socket: Socket) {
    socket.disconnect();
  }

  private disconnect(socket: Socket) {
    socket.emit('Error', new UnauthorizedException());
    socket.disconnect();
  }
}
