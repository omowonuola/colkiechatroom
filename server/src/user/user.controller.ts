import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserCredentialsDto } from './dto/user-credentials.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserEntity } from './entity/users.entity';

@Controller('api/users')
@ApiTags('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/signup')
  @ApiOperation({ summary: 'Create New User' })
  @ApiResponse({
    description: 'create new user to the database',
    type: UserEntity,
  })
  signUp(@Body() userCredentialsDto: UserCredentialsDto): Promise<void> {
    return this.userService.signUp(userCredentialsDto);
  }
}
