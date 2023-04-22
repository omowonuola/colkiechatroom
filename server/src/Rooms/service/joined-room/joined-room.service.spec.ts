import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { JoinedRoomService } from './joined-room.service';
import { JoinedRoomEntity } from '../../model/joined-room/joined-room.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../../../user/model/users.entity';
import { RoomEntity } from '../../model/rooms/rooms.entity';

describe('JoinedRoomService', () => {
  let service: JoinedRoomService;
  let repository: Repository<JoinedRoomEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JoinedRoomService,
        {
          provide: getRepositoryToken(JoinedRoomEntity),
          useClass: class MockRepository extends Repository<JoinedRoomEntity> {},
        },
      ],
    }).compile();

    service = module.get<JoinedRoomService>(JoinedRoomService);
    repository = module.get<Repository<JoinedRoomEntity>>(
      getRepositoryToken(JoinedRoomEntity),
    );
  });

  describe('create', () => {
    it('should create a joined room', async () => {
      const user: UserEntity = new UserEntity();
      user.id = '123';
      user.username = 'john_doe';
      user.email = 'john_doe@example.com';
      user.password = 'password';

      const room: RoomEntity = {
        id: '123',
        name: 'My Room',
        description: 'A description of my room',
        users: [],
        joinedUsers: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        messages: [],
      };

      const joinedRoom: JoinedRoomEntity = {
        id: '1',
        user,
        room,
        socketId: '4',
      };
      const createdJoinedRoom: JoinedRoomEntity = {
        id: '1',
        user,
        room,
        socketId: '4',
      };
      jest.spyOn(repository, 'save').mockResolvedValueOnce(createdJoinedRoom);

      const result = await service.create(joinedRoom);

      expect(result).toEqual(createdJoinedRoom);
      expect(repository.save).toHaveBeenCalledWith(joinedRoom);
    });
  });
});
