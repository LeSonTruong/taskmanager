import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from './entities/user.entity';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 1. ĐĂNG KÝ: Ai cũng có thể gọi API này để tạo tài khoản
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // 2. XEM TẤT CẢ: Chỉ những người ĐÃ ĐĂNG NHẬP (có Token) mới xem được
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // 3. XEM CHI TIẾT: Chỉ người đã đăng nhập mới xem được
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  // 4. CẬP NHẬT: Tạm thời cho phép bất kỳ ai đã đăng nhập (Bạn có thể nâng cấp sau)
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  // 5. XÓA: CỰC KỲ QUAN TRỌNG - Chỉ ADMIN mới được xóa người dùng
  @UseGuards(JwtAuthGuard, RolesGuard) // Lớp 1: Đăng nhập, Lớp 2: Kiểm tra Role
  @Roles(UserRole.ADMIN) // Dán nhãn chỉ cho Admin vào
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
