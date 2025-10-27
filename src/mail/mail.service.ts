import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendNoteCreatedEmail(to: string, noteTitle: string) {
    await this.mailerService.sendMail({
      to,
      subject: `Nova nota criada: ${noteTitle}`,
      text: `A nota "${noteTitle}" foi criada com sucesso.`,
      html: `<p>A nota <strong>${noteTitle}</strong> foi criada com sucesso.</p>`,
    });
  }
}
