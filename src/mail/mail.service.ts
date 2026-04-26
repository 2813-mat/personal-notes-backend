import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendNoteCreatedEmail(to: string[], noteTitle: string) {
    await this.mailerService.sendMail({
      to,
      subject: `Nova nota criada: ${noteTitle}`,
      text: `A nota "${noteTitle}" foi criada com sucesso.`,
      html: `<p>A nota <strong>${noteTitle}</strong> foi criada com sucesso.</p>`,
    });
  }

  async sendNoteUpdatedEmail(to: string[], noteTitle: string) {
    await this.mailerService.sendMail({
      to,
      subject: `Nota atualizada: ${noteTitle}`,
      text: `A nota "${noteTitle}" foi atualizada.`,
      html: `<p>A nota <strong>${noteTitle}</strong> foi atualizada.</p>`,
    });
  }

  async sendNoteDeletedEmail(to: string[], noteTitle: string) {
    await this.mailerService.sendMail({
      to,
      subject: `Nota deletada: ${noteTitle}`,
      text: `A nota "${noteTitle}" foi deletada.`,
      html: `<p>A nota <strong>${noteTitle}</strong> foi deletada.</p>`,
    });
  }
}
