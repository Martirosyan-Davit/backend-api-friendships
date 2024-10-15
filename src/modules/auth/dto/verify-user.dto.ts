import { EmailField, StringField } from '../../../decorators';

export class VerifyUserDto {
  @EmailField()
  readonly email!: string;

  @StringField()
  readonly pin!: string;
}
