import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { RoomEntity } from 'src/Rooms/model/rooms/rooms.entity';

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

  @ManyToMany(() => RoomEntity, (room) => room.users)
  rooms: RoomEntity[];
}
