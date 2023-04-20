import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import { UserEntity } from './model/users.entity';
import { UserI } from './model/user.interface';

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
  signUp(@Body() userCredentialsDto: CreateUserDto): Promise<object> {
    return this.userService.signUp(userCredentialsDto);
  }

  @Post('/signin')
  @ApiOperation({ summary: 'SignIn User' })
  @ApiResponse({
    description: 'sign in to the application',
    type: UserEntity,
  })
  signIn(@Body() authCredentialsDto: CreateUserDto): Promise<object> {
    return this.userService.signInUser(authCredentialsDto);
  }

  @Get()
  @ApiOperation({ summary: 'FindAll User' })
  @ApiResponse({
    description: 'find all user in the application',
    type: UserEntity,
  })
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<Pagination<UserI>> {
    limit = limit > 100 ? 100 : limit;
    return this.userService.findAllUsers({
      page,
      limit,
      route: 'http://localhost:3000/api/users',
    });
  }

  @Get('/findbyusername')
  @ApiOperation({ summary: 'find by username' })
  @ApiResponse({
    description: 'find user by username in the application',
    type: UserEntity,
  })
  async findAllByUsername(@Query('username') username: string) {
    return this.userService.findUsersByUsername(username);
  }
}
