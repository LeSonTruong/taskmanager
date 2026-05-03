import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { MailService } from '../mail/mail.service';
export declare class AuthService {
    private usersService;
    private jwtService;
    private mailService;
    constructor(usersService: UsersService, jwtService: JwtService, mailService: MailService);
    login(email: string, pass: string): Promise<{
        access_token: string;
    }>;
    register(createUserDto: CreateUserDto): Promise<{
        message: string;
        email: string;
    }>;
    private generateVerificationCode;
    verifyEmail(token: string | null): Promise<boolean>;
}
