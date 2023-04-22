import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from './model/users.entity';
import { UserRepository } from './user.repository';
import { LoginUserDto } from './dto/login-user.dto';
import {
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersService', () => {
  let usersService: UserRepository;
  let userRepositoryMock;

  const jwtServiceMock = {
    sign: jest.fn(() => 'access_token'),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      providers: [
        UserRepository,
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

    usersService = moduleRef.get<UserRepository>(UserRepository);
    userRepositoryMock = moduleRef.get(getRepositoryToken(UserEntity));
  });

  describe('createUser', () => {
    const userCredentialsDto: CreateUserDto = {
      username: 'john_doe',
      email: 'john_doe@example.com',
      password: 'password',
    };

    it('should create a new user', async () => {
      const hashedPassword = 'hashedPassword';
      const createdUser = { ...userCredentialsDto, password: hashedPassword };
      userRepositoryMock.findOne.mockReturnValue(undefined);
      userRepositoryMock.create.mockReturnValue(createdUser);
      userRepositoryMock.save.mockReturnValue(createdUser);

      const result = await usersService.createUser(userCredentialsDto);

      expect(result).toEqual({ status: 'SUCCESS', saveUser: createdUser });
    });

    it('throws a ConflictException if username or email already exists', async () => {
      jest
        .spyOn(userRepositoryMock, 'save')
        .mockRejectedValue({ code: 'ER_DUP_ENTRY' });

      const userCredentialsDto: CreateUserDto = {
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password',
      };

      await expect(usersService.createUser(userCredentialsDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw a ConflictException if any required fields are missing', async () => {
      userRepositoryMock.save.mockRejectedValue({
        code: 'ER_NO_DEFAULT_FOR_FIELD',
      });
      await expect(
        usersService.createUser(userCredentialsDto),
      ).rejects.toThrowError(ConflictException);
    });

    it('should throw an InternalServerErrorException if any other error occurs', async () => {
      userRepositoryMock.save.mockRejectedValue(new Error());
      await expect(
        usersService.createUser(userCredentialsDto),
      ).rejects.toThrowError(InternalServerErrorException);
    });
  });

  describe('signInUser', () => {
    const userCredentialsDto: LoginUserDto = {
      email: 'test@test.com',
      password: 'password',
    };
    it('should throw an UnauthorizedException if email or password are missing', async () => {
      await expect(
        usersService.signInUser({
          email: '',
          password: '',
        }),
      ).rejects.toThrowError(UnauthorizedException);
      await expect(
        usersService.signInUser({
          email: 'test@test.com',
          password: '',
        }),
      ).rejects.toThrowError(UnauthorizedException);
      await expect(
        usersService.signInUser({
          password: 'password',
          email: '',
        }),
      ).rejects.toThrowError(UnauthorizedException);
    });

    it('should throw an UnauthorizedException if user is not found', async () => {
      jest
        .spyOn(userRepositoryMock, 'findOne')
        .mockResolvedValueOnce(undefined);

      await expect(
        usersService.signInUser(userCredentialsDto),
      ).rejects.toThrowError(UnauthorizedException);
    });

    it('should throw an UnauthorizedException if password is incorrect', async () => {
      const user = {
        email: 'test@test.com',
        password: await bcrypt.hash('password', 10),
      };
      jest.spyOn(userRepositoryMock, 'findOne').mockResolvedValueOnce(user);

      await expect(
        usersService.signInUser({
          email: 'test@test.com',
          password: 'wrong_password',
        }),
      ).rejects.toThrowError(UnauthorizedException);
    });

    it('should return status, id, email and accessToken if user is found and password is correct', async () => {
      const user = {
        id: 1,
        email: 'test@test.com',
        password: await bcrypt.hash('password', 10),
      };
      jest.spyOn(userRepositoryMock, 'findOne').mockResolvedValueOnce(user);
      jest.spyOn(jwtServiceMock, 'sign').mockReturnValueOnce('access_token');

      const result = await usersService.signInUser(userCredentialsDto);

      expect(result.id).toBe(user.id);
      expect(result.email).toBe(user.email);
      expect(result.accessToken).toBe('access_token');
    });
  });
});
