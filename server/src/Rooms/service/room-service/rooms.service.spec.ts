import { Test } from '@nestjs/testing';
import { RoomsService } from './rooms.service';
import { RoomEntity } from '../../model/rooms/rooms.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserI } from 'src/user/model/user.interface';
import { RoomI } from 'src/Rooms/model/rooms/rooms.interface';

describe('RoomsService', () => {
  let roomsService: RoomsService;
  let roomRepository: Repository<RoomEntity>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        RoomsService,
        {
          provide: getRepositoryToken(RoomEntity),
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
            createQueryBuilder: jest.fn(),
          },
        },
      ],
    }).compile();

    roomsService = moduleRef.get<RoomsService>(RoomsService);
    roomRepository = moduleRef.get<Repository<RoomEntity>>(
      getRepositoryToken(RoomEntity),
    );
  });

  describe('createRoom', () => {
    it('should create a new room', async () => {
      const room: RoomI = {
        name: 'Test Room',
        description: 'This is a test room',
      };
      const creator: UserI = {
        id: '1',
        username: 'John Doe',
        email: 'johndoe@example.com',
      };
      const roomEntity: RoomEntity = {
        id: '1',
        name: room.name,
        description: room.description,
        joinedUsers: [],
        messages: [],
        users: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest
        .spyOn(roomRepository, 'save')
        .mockImplementation(() => Promise.resolve(roomEntity));
      const createdRoom = await roomsService.createRoom(room, creator);
      expect(createdRoom).toEqual(roomEntity);
    });
  });


});
