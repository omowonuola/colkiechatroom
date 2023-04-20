import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway({
  cors: { origin: ['https://hoppscotch.io', 'http://localhost:8080'] },
})
export class RoomGateway {
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello World!';
  }
}
