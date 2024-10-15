import { NotFoundException } from '@nestjs/common';

export class UserAlreadyVerifiedException extends NotFoundException {
  constructor() {
    super('error.userAlreadyVerified');
  }
}
