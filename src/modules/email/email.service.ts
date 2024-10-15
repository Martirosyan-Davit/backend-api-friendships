import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

import { ApiConfigService } from '../../shared/services/api-config.service';
import { getVerifyUserTemplate } from './templates/verify-user.template';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private apiConfigService: ApiConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.apiConfigService.nodemailerConfig.email,
        pass: this.apiConfigService.nodemailerConfig.pass,
      },
    });
  }

  async sendVerificationEmail(email: string, pinCode: string) {
    return this.sendEmail(
      email,
      'Account activation',
      getVerifyUserTemplate(pinCode),
    );
  }

  private async sendEmail(to: string, subject: string, text: string) {
    const mailOptions: nodemailer.SendMailOptions = {
      from: this.apiConfigService.nodemailerConfig.email,
      to,
      subject,
      html: text,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.info('Email sent successfully.');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}
