import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

// Nên tách ra file login-dto.ts sau này nếu project lớn
export class LoginDto {
  email!: string;
  password!: string;
}

@Controller('auth')
export class AuthController {
  // 1. Đưa constructor lên đây
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: LoginDto) {
    return this.authService.login(signInDto.email, signInDto.password);
  }

  @Get('verify')
  async verifyEmail(@Query('token') token: string) {
    const result = await this.authService.verifyEmail(token);
    if (result) {
      // Trả về Object để Frontend dễ bắt data.message
      return {
        success: true,
        message: 'Xác thực thành công! Bạn có thể đăng nhập ngay bây giờ.',
      };
    } else {
      return {
        success: false,
        message: 'Xác thực thất bại! Token không hợp lệ hoặc đã hết hạn.',
      };
    }
  }
}
