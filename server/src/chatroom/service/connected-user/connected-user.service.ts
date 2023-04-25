import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConnectedUserEntity } from '../../model/connected-user/connected-user.entity';
import { ConnectedUserI } from '../../model/connected-user/connected-user.interface';
import { UserI } from '../../../user/model/user.interface';
import { Repository } from 'typeorm';

@Injectable()
export class ConnectedUserService {
  private readonly logger = new Logger(ConnectedUserService.name);
  constructor(
    @InjectRepository(ConnectedUserEntity)
    private readonly connectedUserRepository: Repository<ConnectedUserEntity>,
  ) {}

  async create(connectedUser: ConnectedUserI): Promise<ConnectedUserI> {
    return this.connectedUserRepository.save(connectedUser);
  }

  async findByUser(user: UserI): Promise<ConnectedUserI[]> {
    return this.connectedUserRepository.find({ where: { user } });
  }

  async deleteBySocketId(socketId: string) {
    return this.connectedUserRepository.delete({ socketId });
  }

  async deleteAll() {
    await this.connectedUserRepository.createQueryBuilder().delete().execute();
  }
}
