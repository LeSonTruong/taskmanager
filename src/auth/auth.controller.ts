import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

// LoginDto with validation
export class LoginDto {
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email!: string;

  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  password!: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.authService.register(createUserDto);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw error;
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: LoginDto) {
    try {
      return await this.authService.login(signInDto.email, signInDto.password);
    } catch (error) {
      throw error;
    }
  }

  @Get('verify')
  async verifyEmail(@Query('token') token: string) {
    if (!token) {
      throw new BadRequestException('Token không được để trống!');
    }

    const result = await this.authService.verifyEmail(token);
    if (result) {
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
