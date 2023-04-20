import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRoomDto {
  @ApiProperty({
    example: 'trespass',
    description: 'The Room Name',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'trespass',
    description: 'The Room Name',
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    example: 'trespass@gmail.com',
    description: 'created At',
  })
  createdAt: Date;

  @ApiProperty({
    example: 'Password',
    description: 'updated At',
  })
  updatedAt: string;
}
