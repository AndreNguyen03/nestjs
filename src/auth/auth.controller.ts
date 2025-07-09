import { Controller } from '@nestjs/common';
import { AuthService } from './providers/auth.service';
import { UsersService } from 'src/users/providers/users.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }
}
