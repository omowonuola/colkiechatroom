import { UserI } from '../../../user/model/user.interface';
import { RoomI } from '../rooms/rooms.interface';

export interface JoinedRoomI {
  id?: string;
  socketId: string;
  user: UserI;
  room: RoomI;
}
