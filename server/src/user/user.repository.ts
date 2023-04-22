import {
  ConflictException,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { UserEntity } from './model/users.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload';
import { UserI } from './model/user.interface';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

export class UserRepository {
  private readonly logger = new Logger(UserRepository.name);
  constructor(
    @InjectRepository(UserEntity)
    private userEntity: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  async createUser(user: UserI): Promise<object> {
    const { username, email, password } = user;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = this.userEntity.create({
      username,
      email,
      password: hashedPassword,
    });

    try {
      //   return await this.userEntity.save(newUser);
      const saveUser = await this.userEntity.save(newUser);
      return { status: 'SUCCESS', saveUser };
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        // checking for duplicate username/email
        throw new ConflictException('Username/Email already exists');
        // checking for all required fields filled
      } else if (error.code === 'ER_NO_DEFAULT_FOR_FIELD') {
        throw new ConflictException('All fields are required');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async signInUser(user: UserI): Promise<any> {
    if (!user.email || !user.password) {
      throw new UnauthorizedException('Please add email and password');
    }
    const email = user.email;
    const checkUser = await this.userEntity.findOne({ where: { email } });

    try {
      if (
        checkUser &&
        (await bcrypt.compare(user.password, checkUser.password))
      ) {
        const id = checkUser.id;
        const payload: UserI = await this.userEntity.findOne({ where: { id } });

        const accessToken: string = await this.jwtService.sign({
          payload,
        });

        return { status: 'SUCCESS', id: checkUser?.id, email, accessToken };
      } else {
        throw new UnauthorizedException('Please check your login details');
      }
    } catch (error) {
      throw new UnauthorizedException('Please check your login details');
    }
  }

  async findAllUsers(options: IPaginationOptions): Promise<Pagination<UserI>> {
    return paginate<UserEntity>(this.userEntity, options);
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

  async verifyJwt(jwt: string): Promise<any> {
    return await this.jwtService.verifyAsync(jwt);
  }
}
