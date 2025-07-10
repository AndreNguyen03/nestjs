import { Controller } from '@nestjs/common';
import { AuthService } from './providers/auth.service';
import { UsersService } from 'src/users/providers/users.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }
}
