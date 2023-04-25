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
import { MessageEntity } from '../message/message.entity';

@Entity()
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
    description: 'The Room Description',
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
    example: JoinedRoomEntity,
    description: 'joinedUsers',
  })
  @OneToMany(() => JoinedRoomEntity, (joinedRoom) => joinedRoom.room)
  joinedUsers: JoinedRoomEntity[];

  @ApiProperty({
    example: MessageEntity,
    description: 'messages',
  })
  @OneToMany(() => MessageEntity, (message) => message.room)
  messages: MessageEntity[];

  @ApiProperty({
    example: '2023-04-23T23:08:33.170Z',
    description: 'created At',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    example: '2023-04-23T23:08:33.170Z',
    description: 'updated At',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
