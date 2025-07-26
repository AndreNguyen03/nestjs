import { BadRequestException, forwardRef, Inject, Injectable, RequestTimeoutException } from '@nestjs/common';
import { User } from '../user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { MailService } from 'src/mail/providers/mail.service';

@Injectable()
export class CreateUserProvider {

    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        @Inject(forwardRef(() => HashingProvider))
        private readonly hashingProvider: HashingProvider,
        private readonly mailService: MailService,
    ) { }

    public async createUser(createUserDto: CreateUserDto): Promise<User> {

        let existingUser: User | null = null;
        // check is user exists with same email
        try {
            existingUser = await this.usersRepository.findOne({
                where: {
                    email: createUserDto.email
                }
            })
        } catch (error) {
            throw new RequestTimeoutException('Unable to process your request at the moment please try again later'),
            {
                description: 'Error connecting to the database'
            }
        }
        // handle exception

        if (existingUser) {
            throw new BadRequestException(
                'The user already exists, please check your email.'
            )
        }

        // create a new user
        let newUser = this.usersRepository.create({
            ...createUserDto,
            password: await this.hashingProvider.hashPassword(createUserDto.password)
        })

        try {
            newUser = await this.usersRepository.save(newUser);
        } catch (error) {
            throw new RequestTimeoutException(
                'Unable to process your request at the moment please try later',
                {
                    description: 'Error connecting to the database'
                }
            )
        }

        try {
            await this.mailService.sendUserWelcomeMail(newUser)
        } catch (error) {
            throw new RequestTimeoutException(error)
        }

        return newUser;
    }
}
