import { UserI } from '../../../user/model/user.interface';
import { RoomI } from '../rooms/rooms.interface';

export interface MessageI {
  id?: string;
  text: string;
  user: UserI;
  room: RoomI;
  createdAt: Date;
  updatedAt: Date;
}
