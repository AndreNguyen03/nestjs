import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { PostsService } from './providers/posts.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from './dtos/create-post.dto';
import { PatchPostDto } from './dtos/patch-post.dto';
import { GetPostsDto } from './dtos/get-posts.dto';
import { ActiveUser } from 'src/auth/decorator/active-user.decorator';
import { ActiveUserData } from 'src/auth/interface/active-user-data.interface';

@Controller('posts')
@ApiTags('Posts')
export class PostsController {

    constructor(private readonly postsService: PostsService) {
    }

    @Get()
    public getPosts(
        @Query() postQuery: GetPostsDto
    ) {
        return this.postsService.findAll(postQuery);
    }

    @Get(':userId')
    public getPostById(@Param('userId') userId: number, @Query() postQuery: GetPostsDto) {
        console.log(postQuery)
        return this.postsService.findAllByUserId(userId, postQuery);
    }

    @ApiOperation({
        summary: 'Create a new post',
        description: 'This endpoint allows you to create a new post with the provided details.'
    })
    @ApiResponse({
        status: 201,
        description: 'Post created successfully.',
        type: CreatePostDto,
    })
    @Post()
    public createPost(@Body() createPostDto: CreatePostDto, @ActiveUser() user: ActiveUserData) {
        return this.postsService.createPost(createPostDto, user);
    }

    @Patch()
    @ApiOperation({
        summary: 'Update an existing post',
        description: 'This endpoint allows you to update an existing post with the provided details.'
    })
    @ApiResponse({
        status: 200,
        description: 'Post updated successfully.',
        type: PatchPostDto,
    })
    public updatePost(@Body() patchPostDto: PatchPostDto) {
        return this.postsService.updatePost(patchPostDto);
    }

    @Delete()
    public deletePost(@Query('id', ParseIntPipe) id: number) {
        return this.postsService.detelePost(id)
    }
}
