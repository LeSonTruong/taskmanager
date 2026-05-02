import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Tên không được để trống' })
  name!: string; // Thêm !

  @IsEmail({}, { message: 'Email không hợp lệ' })
  email!: string; // Thêm !

  @IsNotEmpty()
  @MinLength(6, { message: 'Mật khẩu phải ít nhất 6 ký tự' })
  password!: string; // Thêm !
}
