import { BadRequestException, forwardRef, Inject, Injectable, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import jwtConfig from 'src/auth/config/jwt.config';
import { GoogleTokenDto } from '../dtos/google-token.dto';
import { UsersService } from 'src/users/providers/users.service';
import { GenerateTokensProvider } from 'src/auth/providers/generate-tokens.provider';

@Injectable()
export class GoogleAuthenticationService implements OnModuleInit {
    private oauthClient: OAuth2Client;

    constructor(
        /**
         * Inject jwtConfiguration
         */
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
        @Inject(forwardRef(() => UsersService))
        private readonly usersService: UsersService,
        private readonly generateTokenProviders: GenerateTokensProvider
    ) { }
    onModuleInit() {
        const clientId = this.jwtConfiguration.googleClientId;
        const clientSecret = this.jwtConfiguration.googleClientSecret;
        this.oauthClient = new OAuth2Client(clientId, clientSecret)
    }

    public async authentication(googleTokenDto: GoogleTokenDto) {
        try {
            // verify google token sent by user
            const loginTicket = await this.oauthClient.verifyIdToken({
                idToken: googleTokenDto.token,
            })
            console.log(loginTicket)
            // extract the payload from google jwt
            const payload = loginTicket.getPayload()

            if (!payload) {
                throw new BadRequestException('no payload detect!');
            }
            const { email, sub: googleId, given_name: firstName, family_name: lastName } = payload
            console.log(`${email} ${googleId}`)
            // find the user in the database using google id
            const user = await this.usersService.findOneByGoogleId(googleId);
            // if google id exists generate token
            if (user) {
                return this.generateTokenProviders.generateToken(user);
            }
            // if not create a new user and then generate tokens
            const newUser = await this.usersService.createGoogleUser({
                email: email as string,
                firstName: firstName as string,
                lastName: lastName as string,
                googleId: googleId
            })

            return this.generateTokenProviders.generateToken(newUser);
        } catch (error) {
            throw new UnauthorizedException(error);
        }
    }
}
