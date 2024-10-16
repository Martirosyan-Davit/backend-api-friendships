import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { CommunicationStatusEnum } from '../../constants';
import { UseDto } from '../../decorators';
import { UserEntity } from '../user/user.entity';
import { CommunicationDto } from './dtos/communication.dto';

@Entity({ name: 'communications' })
@UseDto(CommunicationDto)
export class CommunicationEntity extends AbstractEntity<CommunicationDto> {
  @Column({ type: 'uuid' })
  followerId!: Uuid;

  @Column({ type: 'uuid' })
  followingId!: Uuid;

  @Column({
    type: 'enum',
    enum: CommunicationStatusEnum,
    default: CommunicationStatusEnum.PENDING,
  })
  status!: CommunicationStatusEnum;

  @ManyToOne(() => UserEntity, (user) => user.followers)
  @JoinColumn({ name: 'follower_id' })
  follower?: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.followings)
  @JoinColumn({ name: 'following_id' })
  following?: UserEntity;
}
