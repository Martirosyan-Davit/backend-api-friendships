import { BadRequestException } from '@nestjs/common';

export class UserUnverifiedException extends BadRequestException {
  constructor() {
    super('error.userUnverified');
  }
}
