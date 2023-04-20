import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../../../user/model/users.entity';
import { JoinedRoomEntity } from '../joined-room/joined-room.entity';

@Entity({ name: 'rooms' })
export class RoomEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'trespass',
    description: 'The Room Name',
  })
  @Column()
  name: string;

  @ApiProperty({
    example: 'trespass',
    description: 'The Room Name',
  })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({
    example: UserEntity,
    description: 'users',
  })
  @ManyToMany(() => UserEntity)
  @JoinTable()
  users: UserEntity[];

  @ApiProperty({
    example: UserEntity,
    description: 'users',
  })
  @OneToMany(() => JoinedRoomEntity, (joinedRoom) => joinedRoom.room)
  joinedUsers: JoinedRoomEntity[];

  @ApiProperty({
    example: 'trespass@gmail.com',
    description: 'created At',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    example: 'Password',
    description: 'updated At',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
export { UserEntity };
