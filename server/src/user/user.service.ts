import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './model/users.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async signUp(userCredentialsDto: CreateUserDto): Promise<any> {
    return this.userRepository.createUser(userCredentialsDto);
  }

  async signInUser(userCredentialsDto: CreateUserDto): Promise<any> {
    return this.userRepository.signInUser(userCredentialsDto);
  }
}
