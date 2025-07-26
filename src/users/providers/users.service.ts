import { BadRequestException, Body, forwardRef, HttpException, HttpStatus, Inject, Injectable, RequestTimeoutException } from "@nestjs/common";
import { GetUsersParamDto } from "../dtos/get-users-param.dto";
import { AuthService } from "src/auth/providers/auth.service";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../user.entity";
import { DataSource, Repository } from "typeorm";
import { CreateUserDto } from "../dtos/create-user.dto";
import { ConfigType } from "@nestjs/config";
import profileConfig from "../config/profile.config";
import { error } from "console";
import { UsersCreateManyProvider } from "./users-create-many.provider";
import { CreateManyUsersDto } from "../dtos/create-many-user.dto";
import { CreateUserProvider } from "./create-user.provider";
import { FindOneUserByEmailProvider } from "./find-one-user-by-email.provider";
import { FindOneByGoogleIdProvider } from "./find-one-by-google-id.provider";
import { CreateGoogleUserProvider } from "./create-google-user.provider";
import { GoogleUser } from "../interfaces/google-user.interface";

/**
 * UsersService is responsible for managing user-related operations.
 * It provides methods to find all users, find a user by ID, and check authentication status
 */
@Injectable()
export class UsersService {



    constructor(
        /**
         * Inject user repository
         */
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        /**
         * Inject usersCreateManyProvider
         */
        private readonly usersCreateManyProvider: UsersCreateManyProvider,
        private readonly createUserProvider: CreateUserProvider,
        private readonly findOneUserByEmailProvider: FindOneUserByEmailProvider,
        private readonly findOneByGoolgeIdProvider: FindOneByGoogleIdProvider,
        private readonly createGoogleUserProvider: CreateGoogleUserProvider
    ) { }

    /**
     * A private array of users to simulate a database.
     * In a real application, this would be replaced with a database call.
     */
    private users = [
        {
            id: '1',
            firstName: 'John',
            email: 'john@doe.com',
        },
        {
            id: '2',
            firstName: 'Jane',
            email: 'jane@alice.com',
        }
    ];

    /**
     * findAll retrieves all users with pagination support.
     * @param limit 
     * @param page 
     * @returns 
     */
    public findAll(limit: number, page: number) {

        throw new HttpException({
            status: HttpStatus.MOVED_PERMANENTLY,
            error: 'The API endpoint is not exist'
        },
            HttpStatus.MOVED_PERMANENTLY,
            {
                cause: Error(),
                description: 'Occured because the API endpoint was permanently moved'
            }
        )

        return this.users;
    }

    /**
     * findById retrieves a user by their ID.
     * This method uses the GetUsersParamDto to extract the user ID.
     * @param getUsersParamDto 
     * @returns 
     */
    public findById(getUsersParamDto: GetUsersParamDto) {
        return this.users.find(user => user.id === getUsersParamDto.id?.toString());
    }

    /**
     * findOneById retrieves a user by their ID.
     * This method is a more direct approach to find a user without using DTO.
     * @param id 
     * @returns 
     */
    public async findOneById(userId: number) {

        let user: User | null = null;

        try {
            user = await this.usersRepository.findOneBy({
                id: userId
            })
        } catch (error) {
            throw new RequestTimeoutException(
                'Unable to process your request at the moment please try again later  ',
                {
                    description: 'Error connecting to the database'
                }
            )
        }

        if (!user) {
            throw new BadRequestException('The user id does not exist');
        }

        return user;
    }

    public async createUser(createUserDto: CreateUserDto) {
        return this.createUserProvider.createUser(createUserDto);
    }

    public async createMany(createManyUsersDto: CreateManyUsersDto) {
        return await this.usersCreateManyProvider.createMany(createManyUsersDto);
    }

    public async findOneByEmail(email: string) {
        return await this.findOneUserByEmailProvider.findOneByEmail(email);
    }

    public async findOneByGoogleId(googleId: string) {
        return await this.findOneByGoolgeIdProvider.findOneByGoogleId(googleId);
    }

    public async createGoogleUser(googleUser: GoogleUser) {
        return await this.createGoogleUserProvider.createGoogleUser(googleUser)
    }
}