import { UserI } from '../../../user/model/user.interface';

export interface RoomI {
  id?: string;
  name?: string;
  description?: string;
  users?: UserI[];
  createdAt?: Date;
  updatedAt?: Date;
}
