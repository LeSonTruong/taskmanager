import { MailerService } from '@nestjs-modules/mailer';
export declare class MailService {
    private mailerService;
    constructor(mailerService: MailerService);
    sendWelcomeEmail(userEmail: string, name: string): Promise<void>;
    sendVerificationEmail(userEmail: string, name: string, verificationCode: string): Promise<void>;
}
