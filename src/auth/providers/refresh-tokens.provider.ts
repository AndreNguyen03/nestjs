import { forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { GenerateTokensProvider } from './generate-tokens.provider';
import { UsersService } from 'src/users/providers/users.service';
import { ActiveUserData } from '../interface/active-user-data.interface';

@Injectable()
export class RefreshTokensProvider {

    constructor(
        private readonly jwtService: JwtService,
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
        private readonly generateTokensProvider: GenerateTokensProvider,
        @Inject(forwardRef(() => UsersService))
        private readonly usersService: UsersService
    ) { }

    public async refreshTokens(refreshTokenDto: RefreshTokenDto) {
        try {
            // verify the refresh token using jwtService
            const { sub } = await this.jwtService.verifyAsync<Pick<ActiveUserData, 'sub'>>(refreshTokenDto.refreshToken, {
                secret: this.jwtConfiguration.secret,
                audience: this.jwtConfiguration.audience,
                issuer: this.jwtConfiguration.issuer
            })
            // fetch user from the database
            const user = await this.usersService.findOneById(sub)

            return await this.generateTokensProvider.generateToken(user);
        } catch (error) {
            throw new UnauthorizedException(error)
        }
        // generate the tokens
    }
}
