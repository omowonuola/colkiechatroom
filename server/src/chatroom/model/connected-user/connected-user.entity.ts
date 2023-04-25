import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../../../user/model/users.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ConnectedUserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: '1234567890',
    description: 'Socket Id',
  })
  @Column()
  socketId: string;

  @ApiProperty({
    example: UserEntity,
    description: 'user',
  })
  @ManyToOne(() => UserEntity, (user) => user.connections)
  @JoinColumn()
  user: UserEntity;
}
