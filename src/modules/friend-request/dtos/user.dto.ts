import { AbstractDto } from '../../../common/dto/abstract.dto';
import { RoleType, UserStatusEnum } from '../../../constants';
import {
  EmailField,
  EnumField,
  NumberField,
  StringField,
} from '../../../decorators';
import { type UserEntity } from '../friend-request.entity';

export class UserDto extends AbstractDto {
  @StringField()
  firstName?: string;

  @StringField()
  lastName?: string;

  @NumberField()
  age!: number | null;

  @EnumField(() => RoleType)
  role!: RoleType;

  @EmailField()
  email!: string;

  @StringField()
  fullName!: string;

  @EnumField(() => UserStatusEnum)
  status!: UserStatusEnum;

  constructor(userEntity: UserEntity) {
    super(userEntity);
    this.firstName = userEntity.firstName;
    this.lastName = userEntity.lastName;
    this.age = userEntity.age;
    this.role = userEntity.role;
    this.email = userEntity.email;
    this.fullName = userEntity.fullName;
    this.status = userEntity.status;
  }
}
