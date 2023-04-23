import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomEntity } from './model/rooms/rooms.entity';
import { RoomsService } from './service/room-service/rooms.service';
import { RoomGateway } from './gateway/room.gateway';
import { UsersModule } from '../user/user.module';
import { ConnectedUserService } from './service/connected-user/connected-user.service';
import { ConnectedUserEntity } from './model/connected-user/connected-user.entity';
import { MessageService } from './service/message/message.service';
import { MessageEntity } from './model/message/message.entity';
import { JoinedRoomService } from './service/joined-room/joined-room.service';
import { JoinedRoomEntity } from './model/joined-room/joined-room.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    TypeOrmModule.forFeature([
      RoomEntity,
      ConnectedUserEntity,
      JoinedRoomEntity,
      MessageEntity,
    ]),
  ],
  providers: [
    RoomsService,
    RoomGateway,
    ConnectedUserService,
    JoinedRoomService,
    MessageService,
  ],
})
export class RoomsModule {}
