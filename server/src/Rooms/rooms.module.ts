import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomEntity } from './model/rooms/rooms.entity';
import { RoomsService } from './service/room-service/rooms.service';
import { RoomsRepository } from './rooms.repository';
import { RoomGateway } from './gateway/room.gateway';
import { UsersModule } from 'src/user/user.module';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([RoomEntity])],
  controllers: [],
  providers: [RoomsService, RoomsRepository, RoomGateway],
})
export class RoomsModule {}
