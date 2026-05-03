import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendWelcomeEmail(userEmail: string, name: string) {
    try {
      console.log('📧 Đang gửi email chào mừng tới:', userEmail);

      await this.mailerService.sendMail({
        to: userEmail,
        from: process.env.MAIL_USER,
        replyTo: process.env.MAIL_USER,
        subject: 'Chào mừng bạn!',
        text: `Chào ${name}, chúc mừng bạn đã đăng ký!`,
        html: `<b>Chào ${name}</b>, chúc mừng bạn đã đăng ký!`,
      });

      console.log('✅ Email chào mừng đã gửi thành công');
    } catch (error) {
      console.error('❌ Lỗi gửi email chào mừng:', error);
      throw new InternalServerErrorException(
        `Không thể gửi email chào mừng: ${error.message}`,
      );
    }
  }

  async sendVerificationEmail(
    userEmail: string,
    name: string,
    verificationCode: string,
  ) {
    try {
      const verificationLink = `${process.env.APP_URL || 'http://localhost:3000'}/auth/verify?token=${verificationCode}`;

      console.log('📧 Đang gửi email xác thực tới:', userEmail);
      console.log('Từ:', process.env.MAIL_USER);

      await this.mailerService.sendMail({
        to: userEmail,
        from: process.env.MAIL_USER,
        replyTo: process.env.MAIL_USER,
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

      console.log('✅ Email xác thực đã gửi thành công');
    } catch (error) {
      console.error('❌ Lỗi gửi email xác thực:', error);
      console.error('Chi tiết lỗi:', {
        message: error.message,
        code: error.code,
        response: error.response,
      });
      throw new InternalServerErrorException(
        `Không thể gửi email xác thực: ${error.message}`,
      );
    }
  }
}
