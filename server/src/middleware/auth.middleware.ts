import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UserI } from 'src/user/model/user.interface';
import { UserRepository } from '../user/user.repository';
import { AuthService } from 'src/auth/service/auth.service';

export interface RequestModel extends Request {
  user: UserI;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private userRepository: UserRepository,
    private authService: AuthService,
  ) {}

  async use(req: RequestModel, res: Response, next: NextFunction) {
    try {
      const tokenArray: string[] = req.headers['authorization'].split(' ');
      const decodedToken = await this.authService.verifyJwt(tokenArray[1]);

      // make sure that the user is not deleted, or that props or rights changed compared to the time when the jwt was issued
      const user: UserI = await this.userRepository.getOne(
        decodedToken.user.id,
      );
      if (user) {
        // add the user to our req object, so that we can access it later when we need it
        // if it would be here, we would like overwrite
        req.user = user;
        next();
      } else {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
    } catch {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }
}
