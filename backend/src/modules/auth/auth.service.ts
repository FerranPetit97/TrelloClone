import { HttpException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { Users } from '../users/entities/users.entity';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/sign-in.dto';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto): Promise<any> {
    const user: Users = await this.usersService.getUserByEmail(signInDto.email);

    if (!user) throw new HttpException('USER_NOT_FOUND', 404);

    let { password, ...data } = user;

    this.tokenGenerator(user);

    const checkPassword = await bcrypt.compare(
      signInDto.password,
      user.password,
    );

    if (!checkPassword) throw new HttpException('PASSWORD_INCORRECT', 403);

    data = {
      ...data,
      access_token: await this.tokenGenerator(user),
      refresh_token: await this.generateRefreshToken(user),
      expiresIn: '300',
    };

    return data;
  }

  async tokenGenerator(user: Users) {
    const payload = { id: user.id, username: user.firstName };
    return await this.jwtService.signAsync(payload, {
      expiresIn: jwtConstants.expiresIn,
    });
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: jwtConstants.secret,
      });
      const user = await this.usersService.getUserById(payload.id);
      if (user) {
        const newPayload = { username: user.firstName, sub: user.id };
        return {
          access_token: this.jwtService.sign(newPayload),
          expiresIn: '300',
        };
      }
    } catch (e) {
      throw new Error('Invalid refresh token');
    }
  }

  private async generateRefreshToken(user: Users) {
    const payload = { id: user.id };
    return await this.jwtService.signAsync(payload, {
      secret: jwtConstants.secret,
      expiresIn: jwtConstants.refreshExpiresIn,
    });
  }
}
