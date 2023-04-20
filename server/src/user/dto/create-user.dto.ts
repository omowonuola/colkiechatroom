import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
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

  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Pressure',
    description: 'Password',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  // @Matches(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/,
  //   {
  //     message: 'password is too weak',
  //   },
  // )
  password: string;
}
