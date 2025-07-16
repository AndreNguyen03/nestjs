import { forwardRef, Inject, Injectable, RequestTimeoutException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { SignInDto } from '../dtos/sign-in.dto';
import { User } from 'src/users/user.entity';
import { SignInProvider } from './sign-in.provider';

@Injectable()
export class AuthService {

    constructor(
        @Inject(forwardRef(() => UsersService)) private readonly usersService: UsersService,
        private readonly signInProvider: SignInProvider
    ) { }

    public async signIn(signInDto: SignInDto) {
        return await this.signInProvider.signIn(signInDto);
    }

    public isAuth() {
        return true;
    }


}

