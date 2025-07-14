import { BadRequestException, forwardRef, HttpException, HttpStatus, Inject, Injectable, RequestTimeoutException } from "@nestjs/common";
import { GetUsersParamDto } from "../dtos/get-users-param.dto";
import { AuthService } from "src/auth/providers/auth.service";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../user.entity";
import { Repository } from "typeorm";
import { CreateUserDto } from "../dtos/create-user.dto";
import { ConfigType } from "@nestjs/config";
import profileConfig from "../config/profile.config";
import { error } from "console";

/**
 * UsersService is responsible for managing user-related operations.
 * It provides methods to find all users, find a user by ID, and check authentication status
 */
@Injectable()
export class UsersService {



    constructor(
        @Inject(forwardRef(() => AuthService)) private readonly authService: AuthService,
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        @Inject(profileConfig.KEY)
        private readonly profileConfiguration: ConfigType<typeof profileConfig>
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

    public async createUser(CreateUserDto: CreateUserDto) {

        let existingUser: User | null = null;
        // check is user exists with same email
        try {
            existingUser = await this.usersRepository.findOne({
                where: {
                    email: CreateUserDto.email
                }
            })
        } catch (error) {
            throw new RequestTimeoutException('Unable to process your request at the moment please try again later  '),
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
        let newUser = this.usersRepository.create(CreateUserDto)

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

        return newUser;
    }


}