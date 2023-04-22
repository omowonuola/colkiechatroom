import { Test, TestingModule } from '@nestjs/testing';
import { ConnectedUserService } from './connected-user.service';
import { Repository } from 'typeorm';
import { ConnectedUserEntity } from '../../../Rooms/model/connected-user/connected-user.entity';
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
            save: jest.fn(),
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
});
