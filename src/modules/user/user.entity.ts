import { Column, Entity, OneToMany, Unique, VirtualColumn } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { RoleType, UserStatusEnum } from '../../constants';
import { UseDto } from '../../decorators';
import { CommunicationEntity } from '../communication/communication.entity';
import { UserDto } from './dtos/user.dto';

@Entity({ name: 'users' })
@Unique(['email'])
@UseDto(UserDto)
export class UserEntity extends AbstractEntity<UserDto> {
  @Column({ type: 'varchar' })
  firstName!: string;

  @Column({ type: 'varchar' })
  lastName!: string;

  @Column({ type: 'varchar', nullable: true })
  age!: number | null;

  @Column({ type: 'enum', enum: RoleType, default: RoleType.USER })
  role!: RoleType;

  @Column({ type: 'varchar' })
  email!: string;

  @Column({ type: 'varchar' })
  password!: string;

  @VirtualColumn({
    type: 'varchar',
    query: (alias) =>
      `SELECT CONCAT(${alias}.first_name, ' ', ${alias}.last_name)`,
  })
  fullName!: string;

  @Column({
    type: 'enum',
    enum: UserStatusEnum,
    default: UserStatusEnum.UNVERIFIED,
  })
  status!: UserStatusEnum;

  @OneToMany(
    () => CommunicationEntity,
    (communication) => communication.follower,
  )
  followers?: CommunicationEntity[];

  @OneToMany(
    () => CommunicationEntity,
    (communication) => communication.following,
  )
  followings?: CommunicationEntity[];
}
