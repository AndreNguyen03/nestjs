import { Injectable, RequestTimeoutException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FindOneUserByEmailProvider {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>
    ) { }

    public async findOneByEmail(email: string) {
        let user: User | null = null;

        try {
            user = await this.usersRepository.findOneBy({
                email: email,
            })
        } catch (error) {
            throw new RequestTimeoutException(
                error,
                'Could not fetch the user'
            )
        }

        if (!user) throw new UnauthorizedException('User does not exist');

        return user;
    }
}
