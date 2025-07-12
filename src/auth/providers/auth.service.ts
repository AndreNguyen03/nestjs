import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';

@Injectable()
export class AuthService {

    constructor(@Inject(forwardRef(() =>UsersService)) private readonly usersService: UsersService) {}

    public login(email: string, password: string) {
        const user = this.usersService.findOneById(1);
        // login return SAMPLETOKEN
        return 'SAMPLE_TOKEN';
    }

    public isAuth() {
        return true;
    }
}

