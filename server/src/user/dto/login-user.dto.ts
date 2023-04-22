import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    example: 'troye@gmail.com',
    description: 'email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'passcode',
    description: 'password',
  })
  @IsNotEmpty()
  password: string;
}
