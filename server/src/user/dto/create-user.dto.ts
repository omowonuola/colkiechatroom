import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'arieli',
    description: 'Username',
  })
  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @ApiProperty({
    example: 'troye@gmail.com',
    description: 'email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Pressure',
    description: 'Password',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  password: string;
}
