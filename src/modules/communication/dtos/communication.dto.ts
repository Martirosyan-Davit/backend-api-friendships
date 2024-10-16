import { AbstractDto } from '../../../common/dto/abstract.dto';
import { CommunicationStatusEnum } from '../../../constants';
import { ClassField, EnumField, UUIDField } from '../../../decorators';
import { UserDto } from '../../user/dtos/user.dto';
import { type CommunicationEntity } from '../communication.entity';

export class CommunicationDto extends AbstractDto {
  @UUIDField()
  followerId!: Uuid;

  @UUIDField()
  followingId!: Uuid;

  @EnumField(() => CommunicationStatusEnum)
  status!: CommunicationStatusEnum;

  @ClassField(() => UserDto)
  follower?: UserDto;

  @ClassField(() => UserDto)
  following?: UserDto;

  constructor(communicationEntity: CommunicationEntity) {
    super(communicationEntity);
    this.followerId = communicationEntity.followerId;
    this.followingId = communicationEntity.followingId;
    this.status = communicationEntity.status;
    this.follower = communicationEntity.follower?.toDto();
    this.following = communicationEntity.following?.toDto();
  }
}
