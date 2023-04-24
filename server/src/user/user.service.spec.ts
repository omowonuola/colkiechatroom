import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from './model/users.entity';
import { UserRepository } from './user.repository';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthService } from '../auth/service/auth.service';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';

describe('UsersService', () => {
  let userService: UserRepository;
  let authService: AuthService;
  let userEntity: Repository<UserEntity>;

  const jwtServiceMock = {
    sign: jest.fn(() => 'access_token'),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      providers: [
        UserRepository,
        AuthService,
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            decodeAccessToken: jest.fn(),
            jwtServiceMock,
          },
        },
      ],
    }).compile();

    userService = moduleRef.get<UserRepository>(UserRepository);
    userEntity = moduleRef.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
    authService = moduleRef.get<AuthService>(AuthService);
  });

  describe('createUser', () => {
    const user: UserEntity = new UserEntity();
    user.id = '1';
    user.username = 'Test User';
    user.email = 'test@example.com';
    user.password = 'password';

    it('should throw a ConflictException when the email is already in use', async () => {
      jest.spyOn(userEntity, 'findOne').mockResolvedValue(user);

      await expect(userService.createUser(user)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('signInUser', () => {
    const user: UserEntity = new UserEntity();
    user.id = '1';
    user.email = 'test@example.com';
    user.password = 'hashedPassword';

    it('should throw an error when given an email that does not exist in the database', async () => {
      jest.spyOn(userEntity, 'findOne').mockResolvedValue(undefined);

      await expect(
        userService.signInUser({
          email: 'test@example.com',
          password: 'password',
        }),
      ).rejects.toThrowError(NotFoundException);
    });
  });
});
