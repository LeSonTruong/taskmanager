import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendWelcomeEmail(userEmail: string, name: string) {
    try {
      await this.mailerService.sendMail({
        to: userEmail,
        from: 'noreply@taskmanager.com',
        subject: 'Chào mừng bạn!',
        text: `Chào ${name}, chúc mừng bạn đã đăng ký!`,
        html: `<b>Chào ${name}</b>, chúc mừng bạn đã đăng ký!`,
      });
    } catch (error) {
      console.error('Lỗi gửi email chào mừng:', error);
      throw new InternalServerErrorException('Không thể gửi email chào mừng');
    }
  }

  async sendVerificationEmail(
    userEmail: string,
    name: string,
    verificationCode: string,
  ) {
    try {
      const verificationLink = `${process.env.APP_URL || 'http://localhost:3000'}/auth/verify?token=${verificationCode}`;

      await this.mailerService.sendMail({
        to: userEmail,
        from: process.env.MAIL_USER || 'noreply@taskmanager.com',
        subject: 'Xác thực Email - TaskManager',
        text: `Chào ${name}!\n\nVui lòng nhập mã xác thực sau:\n${verificationCode}\n\nHoặc click vào link sau:\n${verificationLink}\n\nMã này sẽ hết hạn sau 24 giờ.`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 500px;">
            <h2 style="color: #333;">Xác thực Email - TaskManager</h2>
            <p>Chào <strong>${name}</strong>!</p>
            <p>Cảm ơn bạn đã đăng ký. Để hoàn tất quá trình đăng ký, vui lòng xác thực email của bạn.</p>
            
            <div style="background-color: #f0f0f0; padding: 20px; border-radius: 5px; text-align: center; margin: 20px 0;">
              <p style="font-size: 14px; color: #666;">Mã xác thực của bạn:</p>
              <p style="font-size: 32px; font-weight: bold; color: #0066cc; letter-spacing: 2px;">${verificationCode}</p>
            </div>
            
            <p style="text-align: center; margin: 20px 0;">
              <a href="${verificationLink}" style="background-color: #0066cc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Xác thực Email
              </a>
            </p>
            
            <p style="font-size: 12px; color: #999; margin-top: 30px;">
              <strong>Lưu ý:</strong> Mã xác thực này sẽ hết hạn sau 24 giờ.<br>
              Nếu bạn không tạo tài khoản này, vui lòng bỏ qua email này.
            </p>
          </div>
        `,
      });
    } catch (error) {
      console.error('Lỗi gửi email xác thực:', error);
      throw new InternalServerErrorException('Không thể gửi email xác thực');
    }
  }
}
