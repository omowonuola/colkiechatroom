import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { RoomEntity } from 'src/Rooms/model/rooms/rooms.entity';
import { ConnectedUserEntity } from 'src/Rooms/model/connected-user/connected-user.entity';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'trespass',
    description: 'The Username',
  })
  @Column({ unique: true })
  username: string;

  @ApiProperty({
    example: 'trespass@gmail.com',
    description: 'The Email',
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({
    example: 'Password',
    description: 'user password',
  })
  @Column()
  password: string;

  @OneToMany(() => ConnectedUserEntity, (connection) => connection.user)
  connections: ConnectedUserEntity[];

  @ManyToMany(() => RoomEntity, (room) => room.users)
  rooms: RoomEntity[];

  @BeforeInsert()
  @BeforeUpdate()
  emailToLowerCase() {
    this.email = this.email.toLowerCase();
    this.username = this.username.toLowerCase();
  }
}
