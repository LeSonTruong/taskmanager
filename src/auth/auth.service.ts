import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common'; // Thêm BadRequestException và InternalServerErrorException
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto'; // Sửa lại đường dẫn tương đối cho chuẩn
import { MailService } from '../mail/mail.service'; // Đừng quên import MailService

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService, // Cần tiêm (inject) MailService vào đây
  ) {}

  async login(email: string, pass: string) {
    // 1. Tìm user
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác!');
    }

    // 2. Kiểm tra xác thực Email (PHẢI ĐẶT TRƯỚC KHI TRẢ VỀ TOKEN)
    if (!user.isVerified) {
      throw new UnauthorizedException(
        'Vui lòng xác thực email trước khi đăng nhập!',
      );
    }

    // 3. So sánh mật khẩu
    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác!');
    }

    // 4. Tạo payload và trả về Token
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register(createUserDto: CreateUserDto) {
    try {
      const user = await this.usersService.create(createUserDto);
      console.log('1. Đã tạo User thành công');

      // Tạo mã xác thực (6 chữ số)
      const verificationCode = this.generateVerificationCode();

      // Lưu mã xác thực vào database
      await this.usersService.updateVerificationToken(
        user.id,
        verificationCode,
      );
      console.log('2. Đã tạo mã xác thực');

      // Gửi email xác thực
      await this.mailService.sendVerificationEmail(
        user.email,
        user.name,
        verificationCode,
      );
      console.log('3. Đã gửi email xác thực');

      return {
        message:
          'Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản của bạn.',
        email: user.email,
      };
    } catch (error) {
      console.error('LỖI ĐĂNG KÝ:', error);
      throw error;
    }
  }

  private generateVerificationCode(): string {
    // Tạo mã 6 chữ số
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async verifyEmail(token: string | null) {
    // 1. Kiểm tra nếu không có token gửi lên
    if (!token) {
      throw new BadRequestException('Token không được để trống!');
    }

    // 2. Tìm user (Lúc này TS đã biết findByToken trả về User | null)
    const user = await this.usersService.findByToken(token);

    // 3. Kiểm tra user tồn tại
    if (!user) {
      throw new BadRequestException('Token không hợp lệ hoặc đã hết hạn!');
    }

    // 4. Lúc này user chắc chắn là kiểu User (không còn null), truy cập .id sẽ an toàn
    await this.usersService.verifyUser(user.id);

    return true;
  }
}
