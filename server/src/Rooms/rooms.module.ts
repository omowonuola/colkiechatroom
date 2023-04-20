import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomEntity } from './model/rooms/rooms.entity';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { RoomsRepository } from './rooms.repository';
import { RoomGateway } from './gateway/room.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([RoomEntity])],
  controllers: [RoomsController],
  providers: [RoomsService, RoomsRepository, RoomGateway],
})
export class RoomsModule {}
