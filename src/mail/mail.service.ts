import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendWelcomeEmail(userEmail: string, name: string) {
    await this.mailerService.sendMail({
      to: userEmail, // Gửi đến ai
      from: 'noreply@taskmanager.com', // Gửi từ ai (tên ảo thôi)
      subject: 'Chào mừng bạn!', // Tiêu đề
      text: `Chào ${name}, chúc mừng bạn đã đăng ký!`, // Nội dung dạng chữ
      html: `<b>Chào ${name}</b>, chúc mừng bạn đã đăng ký!`, // Nội dung dạng giao diện
    });
  }
}
