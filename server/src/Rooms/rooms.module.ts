import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomEntity } from './model/rooms/rooms.entity';
import { RoomsService } from './service/room-service/rooms.service';
import { RoomGateway } from './gateway/room.gateway';
import { UsersModule } from '../user/user.module';
import { ConnectedUserService } from './service/connected-user/connected-user.service';
import { ConnectedUserEntity } from './model/connected-user/connected-user.entity';
import { MessageService } from './service/message/rooms.service';
import { MessageEntity } from './model/message/message.entity';
import { JoinedRoomService } from './service/joined-room/joined-room.service';
import { JoinedRoomEntity } from './model/joined-room/joined-room.entity';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([
      RoomEntity,
      ConnectedUserEntity,
      JoinedRoomEntity,
      MessageEntity,
    ]),
  ],
  controllers: [],
  providers: [
    RoomsService,
    RoomGateway,
    ConnectedUserService,
    JoinedRoomService,
    MessageService,
  ],
})
export class RoomsModule {}
