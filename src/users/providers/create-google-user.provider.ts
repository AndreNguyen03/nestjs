import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { GoogleUser } from '../interfaces/google-user.interface';

@Injectable()
export class CreateGoogleUserProvider {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>
    ) { }

    public async createGoogleUser(googleUser: GoogleUser) {
        try {
            console.log(`create google user provider :::`)
            console.log(googleUser);
            const user = this.usersRepository.create(googleUser);
            console.log(user);
            return await this.usersRepository.save(user);
        } catch (error) {
            throw new ConflictException(error, {
                description: 'Could not create a new user!'
            })
        }
    }
}
