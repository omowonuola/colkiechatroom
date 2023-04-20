import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomEntity } from './model/rooms/rooms.entity';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { RoomsRepository } from './rooms.repository';

@Module({
  imports: [TypeOrmModule.forFeature([RoomEntity])],
  controllers: [RoomsController],
  providers: [RoomsService, RoomsRepository],
})
export class RoomsModule {}
