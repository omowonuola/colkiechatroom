import { Test, TestingModule } from '@nestjs/testing';
import { ConnectedUserService } from './connected-user.service';
import { DeleteResult, Repository } from 'typeorm';
import { ConnectedUserEntity } from '../../model/connected-user/connected-user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../../../user/model/users.entity';

describe('ConnectedUserService', () => {
  let service: ConnectedUserService;
  let repository: Repository<ConnectedUserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConnectedUserService,
        {
          provide: getRepositoryToken(ConnectedUserEntity),
          useValue: {
            find: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ConnectedUserService>(ConnectedUserService);
    repository = module.get<Repository<ConnectedUserEntity>>(
      getRepositoryToken(ConnectedUserEntity),
    );
  });

  describe('create', () => {
    it('should save a connected user', async () => {
      const user: UserEntity = new UserEntity();
      user.id = '123';
      user.username = 'john_doe';
      user.email = 'john_doe@example.com';
      user.password = 'password';

      const connectedUser: ConnectedUserEntity = {
        id: '1',
        user,
        socketId: '3',
      };
      const savedConnectedUser: ConnectedUserEntity = {
        id: '1',
        user,
        socketId: '3',
      };
      jest.spyOn(repository, 'save').mockResolvedValueOnce(savedConnectedUser);

      const result = await service.create(connectedUser);

      expect(result).toEqual(savedConnectedUser);
      expect(repository.save).toHaveBeenCalledWith(connectedUser);
    });
  });

  describe('findByUser', () => {
    it('should return an array of connected users associated with the given user', async () => {
      const user: UserEntity = new UserEntity();
      user.id = '123';
      user.username = 'john_doe';
      user.email = 'john_doe@example.com';
      user.password = 'password';

      const connectedUser1: ConnectedUserEntity = {
        id: '1',
        user,
        socketId: 'abc123',
      };
      const connectedUser2: ConnectedUserEntity = {
        id: '2',
        user,
        socketId: 'def456',
      };
      jest
        .spyOn(repository, 'find')
        .mockResolvedValueOnce([connectedUser1, connectedUser2]);

      const result = await service.findByUser(user);

      expect(result).toEqual([connectedUser1, connectedUser2]);
      expect(repository.find).toHaveBeenCalledWith({ where: { user } });
    });
  });

  describe('deleteBySocketId', () => {
    it('should delete a connected user by its socket id', async () => {
      const socketId = 'abc123';
      const deleteResult: DeleteResult = {
        affected: 1,
        raw: {},
      };

      jest.spyOn(repository, 'delete').mockResolvedValueOnce(deleteResult);

      await expect(await service.deleteBySocketId(socketId)).toEqual({
        affected: 1,
        raw: {},
      });

      expect(repository.delete).toHaveBeenCalledWith({ socketId });
    });
  });
});
