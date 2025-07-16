import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './providers/auth.service';
import { UsersService } from 'src/users/providers/users.service';
import { ApiTags } from '@nestjs/swagger';
import { SignInDto } from './dtos/sign-in.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('sign-in')
    @HttpCode(
        HttpStatus.OK
    )
    public async signIn(@Body() signInDto: SignInDto) {
        return this.authService.signIn(signInDto)
    }
}
