import { AuthService } from './auth.service';
import { CreateUserDto } from "../users/dto/create-user.dto";
export declare class LoginDto {
    email: string;
    password: string;
}
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(createUserDto: CreateUserDto): Promise<{
        message: string;
        email: string;
    }>;
    signIn(signInDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: number;
            name: string;
            email: string;
        };
    }>;
    verifyEmail(token: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
