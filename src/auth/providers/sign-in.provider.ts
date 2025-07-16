import { forwardRef, Inject, Injectable, RequestTimeoutException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { SignInDto } from '../dtos/sign-in.dto';
import { HashingProvider } from './hashing.provider';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import jwtConfig from '../config/jwt.config';

@Injectable()
export class SignInProvider {
    constructor(
        @Inject(forwardRef(() => UsersService))
        private readonly usersService: UsersService,
        private readonly hashingProvider: HashingProvider,
        private readonly jwtService: JwtService,
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>
    ) { }

    public async signIn(signInDto: SignInDto) {
        // find user if exists
        let user = await this.usersService.findOneByEmail(signInDto.email);

        // compare password hash
        let isEqual: boolean = false;

        try {
            isEqual = await this.hashingProvider.comparePassword(
                signInDto.password,
                user.password
            )
        } catch (error) {
            throw new RequestTimeoutException(
                error,
                {
                    description: 'could not compare passwords'
                }
            )
        }

        if (!isEqual) {
            throw new UnauthorizedException('Incorrect password')
        }

        const accessToken = await this.jwtService.signAsync(
            {
                sub: user.id,
                email: user.email,
            },
            {
                audience: this.jwtConfiguration.audience,
                issuer: this.jwtConfiguration.issuer,
                secret: this.jwtConfiguration.secret,
                expiresIn: this.jwtConfiguration.accessTokenTTL
            }
        );

        return {
            accessToken
        }
    }
}
