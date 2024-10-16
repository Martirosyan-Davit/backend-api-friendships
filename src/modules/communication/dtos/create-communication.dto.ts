import { UUIDField } from '../../../decorators';

export class CreateCommunicationDto {
  @UUIDField()
  recipientId!: Uuid;
}
