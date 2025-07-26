import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserProvider } from './create-user.provider';
import { MailService } from 'src/mail/providers/mail.service';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { DataSource, ObjectLiteral, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { BadRequestException } from '@nestjs/common';

type MockRepository<T extends ObjectLiteral = any> = Partial<Record<keyof Repository<T>, jest.Mock>>
const createMockRepository = <T extends ObjectLiteral = any>(): MockRepository<T> => ({
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn()
})
describe('CreateUserProvider', () => {

    let provider: CreateUserProvider;
    let usersRepository: MockRepository;
    const user = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@doe.com',
        password: 'password'
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CreateUserProvider,
                { provide: DataSource, useValue: {} },
                { provide: getRepositoryToken(User), useValue: createMockRepository() },
                { provide: MailService, useValue: { sendUserWelcome: jest.fn(() => Promise.resolve()) } },
                { provide: HashingProvider, useValue: { hashPassword: jest.fn(() => user.password) } },
            ],
        }).compile()

        provider = module.get<CreateUserProvider>(CreateUserProvider);
        usersRepository = module.get(getRepositoryToken(User));
    });

    it('CreateUserProvider should be defined', () => {
        expect(provider).toBeDefined()
    })

    describe('createUser', () => {
        describe('When the user does not exist in database', () => {
            it('should create a new user', async () => {
                usersRepository.findOne?.mockRejectedValue(null);
                usersRepository.create?.mockRejectedValue(user);
                usersRepository.save?.mockRejectedValue(user);

                const newUser = await provider.createUser(user);
                expect(usersRepository.findOne).toHaveBeenCalledWith({
                    where: { email: user.email },
                });
                expect(usersRepository.create).toHaveBeenCalledWith(user);
                expect(usersRepository.save).toHaveBeenCalledWith(user);
            });
        });
        describe('When user exists', () => {
            it('throw BadRequestException', async () => {
                usersRepository.findOne?.mockRejectedValue(user.email);
                usersRepository.create?.mockRejectedValue(user);
                usersRepository.save?.mockRejectedValue(user);

                try {
                    const newUser = await provider.createUser(user);
                } catch (error) {
                    expect(error).toBeInstanceOf(BadRequestException);
                }
            });
        });
    })
});
