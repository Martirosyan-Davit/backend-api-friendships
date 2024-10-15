import { Injectable } from '@nestjs/common';

import { MessageType } from '../../constants';
import { type IMessage } from '../../interfaces/index';
import { JwtTokenService } from '../../shared/services/jwt-token.service';
import { RedisService } from '../../shared/services/redis.service';
import { UserService } from '../user/user.service';
import { LoginPayloadDto } from './dto/login-payload.dto';
import { type UserLoginDto } from './dto/user-login.dto';
import { type VerifyUserDto } from './dto/verify-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtTokenService: JwtTokenService,
    private userService: UserService,
    private redisService: RedisService,
  ) {}

  async login(userLoginDto: UserLoginDto): Promise<LoginPayloadDto> {
    const userDto = await this.userService.login(userLoginDto);

    const token = await this.jwtTokenService.createAccessToken({
      userId: userDto.id,
      role: userDto.role,
    });

    return new LoginPayloadDto(userDto, token);
  }

  async verifyUser(verifyUserDto: VerifyUserDto): Promise<LoginPayloadDto> {
    const userDto = await this.userService.verify(
      verifyUserDto.email,
      verifyUserDto.pin,
    );

    const token = await this.jwtTokenService.createAccessToken({
      role: userDto.role,
      userId: userDto.id,
    });

    return new LoginPayloadDto(userDto, token);
  }

  async logout(id: Uuid): Promise<IMessage> {
    await this.redisService.removeSessionToken(id);

    return { message: MessageType.SUCCESSFULLY_LOGGED_OUT };
  }
}
