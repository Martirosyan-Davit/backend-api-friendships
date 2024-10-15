import { PageOptionsDto } from '../../../common/dto/page-options.dto';
import { NumberFieldOptional } from '../../../decorators';

export class UsersPageOptionsDto extends PageOptionsDto {
  @NumberFieldOptional()
  age?: number;
}
