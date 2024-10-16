import { PageOptionsDto } from '../../../common/dto/page-options.dto';
import { CommunicationStatusEnum } from '../../../constants';
import { EnumFieldOptional } from '../../../decorators';

export class CommunicationPageOptionsDto extends PageOptionsDto {
  @EnumFieldOptional(() => CommunicationStatusEnum)
  status?: CommunicationStatusEnum;
}
