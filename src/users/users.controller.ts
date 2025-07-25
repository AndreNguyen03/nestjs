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
    UseGuards,
    SetMetadata,
    UseInterceptors,
    ClassSerializerInterceptor,

} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetUsersParamDto } from './dtos/get-users-param.dto';
import { PatchUserDto } from './dtos/patch-user.dto';
import { UsersService } from './providers/users.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateManyUsersDto } from './dtos/create-many-user.dto';
import { AccessTokenGuard } from 'src/auth/guards/access-token/access-token.guard';
import { Auth } from 'src/auth/decorator/auth.decorator';
import { AuthType } from 'src/auth/enum/auth-type.enum';

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
    @Auth(AuthType.None)
    @UseInterceptors(ClassSerializerInterceptor)
    public createUser(@Body() createUserDto: CreateUserDto) {

        return this.usersService.createUser(createUserDto);
    }

    @Patch()
    public patchUser(@Body() patchUserDto: PatchUserDto) {
        return 'you sent a patch request !';
    }

    @Post('create-many')
    public createManyUsers(@Body() createManyUsersDto: CreateManyUsersDto) {
        return this.usersService.createMany(createManyUsersDto);
    }
}
