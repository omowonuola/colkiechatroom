import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomEntity } from './model/rooms/rooms.entity';
import { RoomsService } from './service/room-service/rooms.service';
import { RoomGateway } from './gateway/room.gateway';
import { UsersModule } from 'src/user/user.module';
import { ConnectedUserService } from './service/connected-user/connected-user.service';
import { ConnectedUserEntity } from './model/connected-user/connected-user.entity';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([RoomEntity, ConnectedUserEntity]),
  ],
  controllers: [],
  providers: [RoomsService, RoomGateway, ConnectedUserService],
})
export class RoomsModule {}
