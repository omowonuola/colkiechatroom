// import { Test, TestingModule } from '@nestjs/testing';
// import { getRepositoryToken } from '@nestjs/typeorm';
// import { MessageEntity } from '../../model/message/message.entity';
// import { MessageService } from '../message/message.service';
// import { RoomEntity } from '../../model/rooms/rooms.entity';
// import { UserEntity } from '../../../user/model/users.entity';
// import { MessageI } from '../../model/message/message.interface';

// const mockRepository = {
//   save: jest.fn().mockImplementation((message: MessageEntity) =>
//     Promise.resolve({
//       id: '1',
//       text: message.text,
//       user: message.user,
//       room: message.room,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     }),
//   ),
//   create: jest.fn().mockImplementation((message: MessageEntity) => ({
//     id: '1',
//     text: message.text,
//     user: message.user,
//     room: message.room,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   })),

//   createQueryBuilder: jest.fn(() => ({
//     leftJoin: jest.fn().mockReturnThis(),
//     where: jest.fn().mockReturnThis(),
//     orderBy: jest.fn().mockReturnThis(),
//     getManyAndCount: jest.fn().mockResolvedValue({
//       items: [],
//       totalCount: 0,
//       page: 1,
//       limit: 10,
//     }),
//   })),
// };

// describe('MessagesService', () => {
//   let service: MessageService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         MessageService,
//         {
//           provide: getRepositoryToken(MessageEntity),
//           useValue: mockRepository,
//         },
//       ],
//     }).compile();

//     service = module.get<MessageService>(MessageService);
//   });

//   describe('create', () => {
//     it('should create a new message', async () => {
//       const user: UserEntity = new UserEntity();
//       user.id = '123';
//       user.username = 'john_doe';
//       user.email = 'john_doe@example.com';
//       user.password = 'password';

//       const room: RoomEntity = {
//         id: '123',
//         name: 'My Room',
//         description: 'A description of my room',
//         users: [],
//         joinedUsers: [],
//         createdAt: new Date(),
//         updatedAt: new Date(),
//         messages: [],
//       };
//       const message: MessageI = {
//         text: 'Hello world',
//         user,
//         room,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//         id: '',
//       };

//       const result = await service.create(message);

//       expect(result.id).toBeDefined();
//       expect(result.text).toEqual(message.text);
//       expect(result.user).toEqual(message.user);
//       expect(result.room).toEqual(message.room);
//       expect(result.createdAt).toEqual(new Date(result.createdAt));
//       expect(result.updatedAt).toEqual(new Date(result.updatedAt));
//       expect(mockRepository.create).toHaveBeenCalledWith(message);
//       // expect(mockRepository.save).toHaveBeenCalledWith(
//       //   mockRepository.create(message),
//       // );
//     });
//   });
// });
