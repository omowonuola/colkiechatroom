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

  describe('getRoom', () => {
    it('should return a room with the given id', async () => {
      // Create a mock room object
      const mockRoom: RoomEntity = {
        id: '123',
        name: 'Test Room',
        description: 'This is a test room',
        users: [],
        joinedUsers: [],
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock the findOne method of the room repository to return the mock room object
      roomRepository.findOne = jest.fn().mockResolvedValue(mockRoom);

      // Call the getRoom method with the id of the mock room object
      const roomId = mockRoom.id;
      const result = await roomsService.getRoom(roomId);

      // Check that the findOne method was called with the correct parameters
      expect(roomRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: roomId,
        },
      });

      // Check that the result is the mock room object
      expect(result).toEqual(mockRoom);
    });
  });

  describe('addRoomCreator', () => {
    it('should add a user to the users array of the room object', async () => {
      // Create a mock room object and user object
      const mockRoom: RoomI = {
        id: '123',
        name: 'Test Room',
        description: 'This is a test room',
        users: [],
      };
      const mockUser: UserI = {
        id: '456',
        username: 'Test User',
        email: 'testuser@test.com',
      };

      // Call the addRoomCreator method with the mock room and user objects
      const result = await roomsService.addRoomCreator(mockRoom, mockUser);

      // Check that the result is the mock room object with the user added to the users array
      expect(result).toEqual({
        id: '123',
        name: 'Test Room',
        description: 'This is a test room',
        users: [mockUser],
      });
    });
  });
});
