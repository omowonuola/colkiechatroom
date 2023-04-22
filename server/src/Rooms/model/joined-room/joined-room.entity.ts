import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RoomEntity } from '../rooms/rooms.entity';
import { UserEntity } from '../../../user/model/users.entity';

@Entity()
export class JoinedRoomEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  socketId: string;

  @ManyToOne(() => UserEntity, (user) => user.joinedRooms)
  @JoinColumn()
  user: UserEntity;

  @ManyToOne(() => RoomEntity, (room) => room.joinedUsers)
  @JoinColumn()
  room: RoomEntity;
}
