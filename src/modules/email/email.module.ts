import { Module } from '@nestjs/common';

import { EmailService } from './email.service';

@Module({
  imports: [],
  controllers: [],
  exports: [EmailService],
  providers: [EmailService],
})
export class EmailModule {}
