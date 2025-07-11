import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { GetUsersParamDto } from "../dtos/get-users-param.dto";
import { AuthService } from "src/auth/providers/auth.service";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../user.entity";
import { Repository } from "typeorm";
import { CreateUserDto } from "../dtos/create-user.dto";

/**
 * UsersService is responsible for managing user-related operations.
 * It provides methods to find all users, find a user by ID, and check authentication status
 */
@Injectable()
export class UsersService {



    constructor(@Inject(forwardRef(() => AuthService)) private readonly authService: AuthService, @InjectRepository(User) private usersRepository: Repository<User>,) { }

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
        const isAuth = this.authService.isAuth()
        console.log(`isAuth: ${isAuth}`);
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
    public findOneById(id: string) {
        return this.users.find(user => user.id === id);
    }

    public async createUser(CreateUserDto: CreateUserDto) {
        // check is user exists with same email
        const existingUser =  await this.usersRepository.findOne({
            where: {
                email: CreateUserDto.email
            }
        })
        // handle exception

        // create a new user
        let newUser = this.usersRepository.create(CreateUserDto)
        newUser = await this.usersRepository.save(newUser);
        
        return newUser;
    }
}