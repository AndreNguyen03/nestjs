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
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('Users') 
export class UsersController {


    constructor(private readonly usersService: UsersService) {
    }

    @Get()
    public getUsers(
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    ) {
        return this.usersService.findAll(limit, page);
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Fetches a list of registered users on the application'
    })
    @ApiResponse({
        status: 200,
        description: 'Users fetched successfully based on the query',
        
    })
    @ApiQuery({
        name: 'limit',
        required: false,
        type: 'number',
        description: 'The number of entries returned per query',
        example: 10,
    })
    @ApiQuery({
        name: 'page',
        required: false,
        type: 'number',
        description: 'The position of the oage number that you want the API to return',
        example: 1,
    })
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
