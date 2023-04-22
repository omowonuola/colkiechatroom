import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomEntity } from '../../model/rooms/rooms.entity';
import {
  IPaginationLinks,
  IPaginationMeta,
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { RoomI } from '../../model/rooms/rooms.interface';
import { UserI } from 'src/user/model/user.interface';

@Injectable()
export class RoomsService {
  private readonly logger = new Logger(RoomsService.name);
  constructor(
    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>,
  ) {}

  async createRoom(room: RoomI, creator: UserI): Promise<RoomI> {
    const createRoom = await this.addRoomCreator(room, creator);
    return this.roomRepository.save(createRoom);
  }

  async getRoom(roomId: string): Promise<RoomI> {
    return this.roomRepository.findOne({
      where: {
        id: roomId,
        // relations: ['users']
      },
    });
  }

  async addRoomCreator(room: RoomI, creator: UserI): Promise<RoomI> {
    if (!room.users) {
      room.users = [];
    }
    room.users.push(creator);
    return room;
  }

  async getRoomsForUser(
    userId: string,
    options: IPaginationOptions,
  ): Promise<Pagination<object>> {
    const query = this.roomRepository
      .createQueryBuilder('room_entity')
      .leftJoin('room_entity.users', 'users')
      .where('users.id = :userId', { userId })
      .leftJoinAndSelect('room_entity.users', 'all_users')
      .orderBy('room_entity.updatedAt', 'DESC');

    return paginate(query, options);
  }
}
