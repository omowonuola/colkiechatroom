import {
  ConflictException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { UserEntity } from './model/users.entity';
import { UserI } from './model/user.interface';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { AuthService } from '../auth/service/auth.service';

export class UserRepository {
  private readonly logger = new Logger(UserRepository.name);
  constructor(
    @InjectRepository(UserEntity)
    private userEntity: Repository<UserEntity>,
    private authService: AuthService,
  ) {}

  async createUser(user: UserI): Promise<object> {
    try {
      const userExists: boolean = await this.mailExists(user.email);
      if (!userExists) {
        const hashPassword: string = await this.hashPassword(user.password);
        // update password field with hashed password
        user.password = hashPassword;
        const saveUser = await this.userEntity.save(
          this.userEntity.create(user),
        );
        return { status: 'SUCCESS', saveUser };
      } else {
        throw new ConflictException('Username/Email already exists');
      }
    } catch (error) {
      throw new ConflictException('Username/Email already exists');
    }
  }

  async signInUser(user: UserI): Promise<object> {
    try {
      const checkUser: UserI = await this.findByEmail(user.email);
      if (checkUser) {
        const matchPassword: boolean = await this.validatePassword(
          user.password,
          checkUser.password,
        );
        if (matchPassword) {
          const payload: UserI = await this.findOne(checkUser.id);
          const accessToken = await this.authService.generateJwt(payload);
          return {
            status: 'SUCCESS',
            id: checkUser?.id,
            email: checkUser?.email,
            accessToken,
          };
        } else {
          throw new UnauthorizedException('Please check your login details');
        }
      } else {
        throw new UnauthorizedException('Please check your login details');
      }
    } catch (error) {
      throw new NotFoundException('User Not Found');
    }
  }

  async findAllUsers(options: IPaginationOptions): Promise<Pagination<UserI>> {
    return paginate<UserEntity>(this.userEntity, options);
  }

  private async findByEmail(email: string): Promise<UserI | null> {
    const user = await this.userEntity.findOne({ where: { email } });
    if (user) {
      return user;
    } else {
      return null;
    }
  }

  async findUsersByUsername(username: string): Promise<UserI[]> {
    return this.userEntity.find({
      where: {
        username: Like(`%${username?.toLowerCase()}%`),
      },
    });
  }

  async getOne(id: string): Promise<UserI> {
    return await this.userEntity.findOneOrFail({ where: { id } });
  }

  private async findOne(id: string): Promise<UserI> {
    return this.userEntity.findOne({ where: { id } });
  }

  private async hashPassword(password: string): Promise<string> {
    return this.authService.hashPassword(password);
  }

  private async validatePassword(
    password: string,
    storedPasswordHash: string,
  ): Promise<any> {
    return this.authService.comparePasswords(password, storedPasswordHash);
  }

  private async mailExists(email: string): Promise<boolean> {
    const user = await this.userEntity.findOne({ where: { email } });
    if (user) {
      return true;
    } else {
      return false;
    }
  }
}
