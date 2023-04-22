import { UserI } from '../../../user/model/user.interface';

export interface ConnectedUserI {
  id?: string;
  socketId: string;
  user: UserI;
}
