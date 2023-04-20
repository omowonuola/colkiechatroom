import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../../../user/model/users.entity';

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

  @ManyToMany(() => UserEntity)
  @JoinTable()
  users: UserEntity[];

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
