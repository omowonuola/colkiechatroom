import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserI } from 'src/user/model/user.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async generateJwt(user: UserI): Promise<string> {
    const payload = { user: user };
    const token = this.jwtService.sign(payload);
    return token;
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async comparePasswords(
    password: string,
    storedPasswordHash: string,
  ): Promise<any> {
    return bcrypt.compare(password, storedPasswordHash);
  }

  verifyJwt(jwt: string): Promise<any> {
    return this.jwtService.verifyAsync(jwt);
  }
}
