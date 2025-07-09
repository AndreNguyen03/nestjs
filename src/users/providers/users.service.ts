import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { GetUsersParamDto } from "../dtos/get-users-param.dto";
import { AuthService } from "src/auth/providers/auth.service";

@Injectable()
export class UsersService {

    constructor(@Inject(forwardRef(() => AuthService)) private readonly authService: AuthService) {}

    private  users = [
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

    public findAll( limit: number, page: number) {
        const isAuth = this.authService.isAuth()
        console.log(`isAuth: ${isAuth}`);
        return this.users;
    }

    public findById(getUsersParamDto : GetUsersParamDto) {
        return this.users.find(user => user.id === getUsersParamDto.id?.toString());
    }

    public findOneById(id : string) {
        return this.users.find(user => user.id === id);
    }
}