import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid'; // npm install uuid

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // 1. CREATE
  async create(createUserDto: CreateUserDto): Promise<User> {
    // 1. Kiểm tra email đã tồn tại chưa
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      throw new BadRequestException('Email này đã được sử dụng!');
    }

    // 2. Hash mật khẩu
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    // 3. Tạo token xác thực email (tạm thời dùng chuỗi ngẫu nhiên)
    const emailToken = uuidv4();

    // 4. Lưu User
    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
      emailToken: emailToken,
    });

    return this.usersRepository.save(newUser);
  }

  // 2. READ ALL
  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  // 3. READ ONE
  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  // 4. UPDATE
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id); // Check xem user có tồn tại không
    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  // 5. DELETE
  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }

  // 6. Tìm user theo email (dùng cho AuthService)
  async findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  // Tìm user qua Token (để xác thực email)
  async findByToken(token: string): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: { emailToken: token },
    });
  }

  // Cập nhật token xác thực email
  async updateVerificationToken(id: number, token: string): Promise<void> {
    await this.usersRepository.update(id, {
      emailToken: token,
    });
  }

  // Cập nhật trạng thái đã xác thực
  async verifyUser(id: number): Promise<void> {
    await this.usersRepository.update(id, {
      isVerified: true,
      emailToken: null,
    });
  }
}
