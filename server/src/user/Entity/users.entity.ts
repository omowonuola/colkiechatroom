import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

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
}
