import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../../../user/model/users.entity';
import { ApiProperty } from '@nestjs/swagger';
import { RoomEntity } from '../rooms/rooms.entity';

@Entity()
export class MessageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'Hello',
    description: 'text',
  })
  @Column()
  text: string;

  @ApiProperty({
    example: UserEntity,
    description: 'user',
  })
  @ManyToOne(() => UserEntity, (user) => user.messages)
  @JoinColumn()
  user: UserEntity;

  @ApiProperty({
    example: RoomEntity,
    description: 'room',
  })
  @ManyToOne(() => RoomEntity, (room) => room.messages)
  @JoinTable()
  room: RoomEntity;

  @ApiProperty({
    example: '2023-04-23T23:08:33.170Z',
    description: 'createdAt',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    example: '2023-04-23T23:08:33.170Z',
    description: 'updatedAt',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
