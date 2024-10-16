import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { PageDto } from '../../common/dto/page.dto';
import { RoleType } from '../../constants';
import { ApiPageOkResponse, Auth, AuthUser, UUIDParam } from '../../decorators';
import { UserDto } from '../user/dtos/user.dto';
import { CommunicationService } from './communication.service';
import { CommunicationDto } from './dtos/communication.dto';
import { CommunicationPageOptionsDto } from './dtos/communication-page-options.dto';
import { CreateCommunicationDto } from './dtos/create-communication.dto';
import { RespondCommunicationDto } from './dtos/respond-communication.dto';

@Controller('communications')
@ApiTags('communications')
export class CommunicationController {
  constructor(private communicationService: CommunicationService) {}

  @Post()
  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiCreatedResponse({
    type: CommunicationDto,
    description: 'Sends a follow request.',
  })
  async sendFollowRequest(
    @Body() createCommunicationDto: CreateCommunicationDto,
    @AuthUser() userDto: UserDto,
  ) {
    await this.communicationService.sendFollowRequest(
      userDto.id,
      createCommunicationDto.recipientId,
    );
  }

  @Patch(':id/respond')
  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: CommunicationDto,
    description: 'Accepts or declines a follow request.',
  })
  async respondToFollowRequest(
    @UUIDParam('id') communicationId: Uuid,
    @AuthUser() userDto: UserDto,
    @Body() respondCommunicationDto: RespondCommunicationDto,
  ) {
    await this.communicationService.respondToFollowRequest(
      communicationId,
      userDto.id,
      respondCommunicationDto.accept,
    );
  }

  @Get('my')
  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get user follow  whit pagination',
    type: PageDto,
  })
  async getMyFollows(
    @Query() communicationPageOptionsDto: CommunicationPageOptionsDto,
    @AuthUser() userDto: UserDto,
  ): Promise<PageDto<CommunicationDto>> {
    return this.communicationService.getMyFollows(
      communicationPageOptionsDto,
      userDto.id,
    );
  }

  @Get(':id')
  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get follow by id',
    type: CommunicationDto,
  })
  async getOne(
    @UUIDParam('id') communicationId: Uuid,
    @AuthUser() userDto: UserDto,
  ): Promise<CommunicationDto> {
    return this.communicationService.getOne(communicationId, userDto.id);
  }
}
