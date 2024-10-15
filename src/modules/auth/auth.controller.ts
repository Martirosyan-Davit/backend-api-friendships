import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Version,
} from '@nestjs/common';
import {
  ApiAcceptedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { RoleType } from '../../constants';
import { Auth, AuthUser } from '../../decorators';
import { type IMessage } from '../../interfaces/index';
import { UserDto } from '../user/dtos/user.dto';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { LoginPayloadDto } from './dto/login-payload.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { VerifyUserDto } from './dto/verify-user.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: UserDto, description: 'Successfully Registered' })
  userRegister(@Body() userRegisterDto: UserRegisterDto): Promise<void> {
    return this.userService.create(userRegisterDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: LoginPayloadDto,
    description: 'User info with access token',
  })
  userLogin(@Body() userLoginDto: UserLoginDto): Promise<LoginPayloadDto> {
    return this.authService.login(userLoginDto);
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @ApiAcceptedResponse({
    type: LoginPayloadDto,
    description: 'Verify whit pin code',
  })
  verifyTeamSms(
    @Body() verifyUserDto: VerifyUserDto,
  ): Promise<LoginPayloadDto> {
    return this.authService.verifyUser(verifyUserDto);
  }

  @Get('logout')
  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.OK)
  @ApiNoContentResponse()
  logout(@AuthUser() user: UserEntity): Promise<IMessage> {
    return this.authService.logout(user.id);
  }

  @Version('1')
  @Get('me')
  @HttpCode(HttpStatus.OK)
  @Auth([RoleType.USER])
  @ApiOkResponse({ type: UserDto, description: 'current user info' })
  getCurrentUser(@AuthUser() user: UserEntity): UserDto {
    return user.toDto();
  }
}
