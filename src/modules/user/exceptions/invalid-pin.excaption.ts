import { BadRequestException } from '@nestjs/common';

export class InvalidPinException extends BadRequestException {
  constructor() {
    super('error.invalidPinException');
  }
}
