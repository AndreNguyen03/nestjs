import { Body, Controller, Post } from '@nestjs/common';
import { GoogleAuthenticationService } from './providers/google-authentication.service';
import { GoogleTokenDto } from './dtos/google-token.dto';
import { Auth } from '../decorator/auth.decorator';
import { AuthType } from '../enum/auth-type.enum';

@Auth(AuthType.None)
@Controller('auth/google-authentication')
export class GoogleAuthenticationController {
    constructor(
        private readonly googleAuthenticationService: GoogleAuthenticationService
    ) {}

    @Post()
    public authenticate(@Body() googleTokenDto: GoogleTokenDto) {
        return this.googleAuthenticationService.authentication(googleTokenDto);
    }
}
