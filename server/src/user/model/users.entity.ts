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
import { RoomEntity } from '../../rooms/model/rooms/rooms.entity';
import { ConnectedUserEntity } from '../../rooms/model/connected-user/connected-user.entity';
import { JoinedRoomEntity } from '../../rooms/model/joined-room/joined-room.entity';
import { MessageEntity } from '../../rooms/model/message/message.entity';
// import { RoomEntity } from 'src/Rooms/model/rooms/rooms.entity';

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

  @ApiProperty({
    example: ConnectedUserEntity,
    description: 'connections',
  })
  @OneToMany(() => ConnectedUserEntity, (connection) => connection.user)
  connections: ConnectedUserEntity[];

  @ApiProperty({
    example: RoomEntity,
    description: 'rooms',
  })
  @ManyToMany(() => RoomEntity, (room) => room.users)
  rooms: RoomEntity[];

  @ApiProperty({
    example: JoinedRoomEntity,
    description: 'joinedRooms',
  })
  @ManyToMany(() => JoinedRoomEntity, (joinedRoom) => joinedRoom.room)
  joinedRooms: JoinedRoomEntity[];

  @OneToMany(() => MessageEntity, (message) => message.user)
  messages: MessageEntity[];

  @BeforeInsert()
  @BeforeUpdate()
  emailToLowerCase() {
    this.email = this.email.toLowerCase();
    this.username = this.username.toLowerCase();
  }
}
