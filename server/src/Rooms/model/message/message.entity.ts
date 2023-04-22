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
    example: '24-3-2020',
    description: 'createdAt',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    example: '24-3-2020',
    description: 'updatedAt',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
