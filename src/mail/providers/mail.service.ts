import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/users/user.entity';

@Injectable()
export class MailService {
    constructor(
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService
    ) { }

    public async sendUserWelcomeMail(user: User): Promise<void> {


        const env = this.configService.get<string>('NODE_ENV');

        if (env === 'test') {
            // 👇 Không gửi mail trong môi trường test
            return;
        }


        await this.mailerService.sendMail({
            to: user.email,
            from: `Onboarding Team <support@nestjs-blog.com>`,
            subject: 'Welcome to NestJs Blog',
            template: './welcome',
            context: {
                name: user.firstName,
                email: user.email,
                loginUrl: 'http://localhost:3000'
            }
        });
    }
}
