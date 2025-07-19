import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import { User } from 'src/users/user.entity';
import { ActiveUserData } from '../interface/active-user-data.interface';

@Injectable()
export class GenerateTokensProvider {
    constructor(
        private readonly jwtService: JwtService,
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>
    ) { }

    public async signToken<T>(userId: number, expiresIn: number, payload?: T) {
        return await this.jwtService.signAsync(
            {
                sub: userId,
                ...payload,
            },
            {
                audience: this.jwtConfiguration.audience,
                issuer: this.jwtConfiguration.issuer,
                secret: this.jwtConfiguration.secret,
                expiresIn
            }
        )
    }

    public async generateToken(user: User) {
        const [accessToken, refreshToken] = await Promise.all([
            // gen access token
            this.signToken<Partial<ActiveUserData>>(user.id, this.jwtConfiguration.accessTokenTTL, { email: user.email }),

            // gen refresh token
            this.signToken(user.id, this.jwtConfiguration.refreshTokenTTL)
        ])

        return { accessToken, refreshToken }
    }
}
