import {
  ConflictException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomEntity, UserEntity } from './model/rooms/rooms.entity';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { RoomI } from './model/rooms/rooms.interface';
import { UserI } from 'src/user/model/user.interface';

export class RoomsRepository {
  private readonly logger = new Logger(RoomsRepository.name);
  constructor(
    @InjectRepository(RoomEntity)
    private roomEntity: Repository<RoomEntity>,
  ) {}

  async createRoom(room: RoomI, creator: UserI): Promise<RoomI> {
    const createRoom = await this.addRoomCreator(room, creator);
    return this.roomEntity.save(createRoom);
  }

  async addRoomCreator(room: RoomI, creator: UserI): Promise<RoomI> {
    room.users.push(creator);
    return room;
  }

  async getRoomsForUser(
    userId: string,
    options: IPaginationOptions,
  ): Promise<Pagination<RoomI>> {
    const query = this.roomEntity
      .createQueryBuilder('room')
      .leftJoin('room.users', 'users')
      .where('users.id = :userId', { userId })
      .leftJoinAndSelect('room.users', 'all_users')
      .orderBy('room.updated_at', 'DESC');

    return paginate(query, options);
  }
}