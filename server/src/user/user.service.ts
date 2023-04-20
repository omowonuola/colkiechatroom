import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './model/users.entity';
import { UserRepository } from './user.repository';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { UserI } from './model/user.interface';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async signUp(userCredentialsDto: CreateUserDto): Promise<object> {
    return this.userRepository.createUser(userCredentialsDto);
  }

  async signInUser(userCredentialsDto: CreateUserDto): Promise<object> {
    return this.userRepository.signInUser(userCredentialsDto);
  }

  async findAllUsers(options: IPaginationOptions): Promise<Pagination<UserI>> {
    return this.userRepository.findAllUsers(options);
  }

  async findUsersByUsername(username: string): Promise<UserI[]> {
    return this.userRepository.findUsersByUsername(username);
  }
}
