import { UserEntity } from '../../../user/model/users.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'connecteduser' })
export class ConnectedUserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  socketId: string;

  @ManyToOne(() => UserEntity, (user) => user.connections)
  @JoinColumn()
  user: UserEntity;
}
