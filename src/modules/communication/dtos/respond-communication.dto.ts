import { BooleanField } from '../../../decorators';

export class RespondCommunicationDto {
  @BooleanField()
  accept!: boolean;
}
