import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Query,
    DefaultValuePipe,
    ValidationPipe,
    Patch,

} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetUsersParamDto } from './dtos/get-users-param.dto';
import { PatchUserDto } from './dtos/patch-user.dto';
import { UsersService } from './providers/users.service';

@Controller('users')
export class UsersController {


    constructor(private readonly usersService: UsersService) {
        // You can inject services here if needed
    }

    @Get()
    public getUsers(
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    ) {
        return this.usersService.findAll(limit, page);
    }

    @Get(':id')
    public getUserById(@Param() getUsersParamDto: GetUsersParamDto) {
        return this.usersService.findById(getUsersParamDto);
    }

    @Post()
    public createUser(@Body() createUserDto: CreateUserDto) {
        console.log(createUserDto);
        return 'you sent a post request !';
    }

    @Patch()
    public patchUser(@Body() patchUserDto: PatchUserDto) {
        return 'you sent a patch request !';
    }
}
