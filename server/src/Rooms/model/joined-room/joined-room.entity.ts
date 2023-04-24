import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RoomEntity } from '../rooms/rooms.entity';
import { UserEntity } from '../../../user/model/users.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class JoinedRoomEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: '12345678900',
    description: 'Socket Id',
  })
  @Column()
  socketId: string;

  @ApiProperty({
    example: UserEntity,
    description: 'user',
  })
  @ManyToOne(() => UserEntity, (user) => user.joinedRooms)
  @JoinColumn()
  user: UserEntity;

  @ApiProperty({
    example: RoomEntity,
    description: 'room',
  })
  @ManyToOne(() => RoomEntity, (room) => room.joinedUsers)
  @JoinColumn()
  room: RoomEntity;
}
