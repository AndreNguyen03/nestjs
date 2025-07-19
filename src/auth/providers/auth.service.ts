import { forwardRef, Inject, Injectable, RequestTimeoutException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { SignInDto } from '../dtos/sign-in.dto';
import { User } from 'src/users/user.entity';
import { SignInProvider } from './sign-in.provider';
import { RefreshTokensProvider } from './refresh-tokens.provider';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';

@Injectable()
export class AuthService {

    constructor(
        @Inject(forwardRef(() => UsersService)) private readonly usersService: UsersService,
        private readonly signInProvider: SignInProvider,
        private readonly refreshTokensProvider: RefreshTokensProvider
    ) { }

    public async signIn(signInDto: SignInDto) {
        return await this.signInProvider.signIn(signInDto);
    }

    public isAuth() {
        return true;
    }

    public async refreshTokens(refreshToken: RefreshTokenDto) {
        return await this.refreshTokensProvider.refreshTokens(refreshToken);
    }

}

