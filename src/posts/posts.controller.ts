import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { PostsService } from './providers/posts.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from './dtos/create-post.dto';
import { PatchPostDto } from './dtos/patch-post.dto';

@Controller('posts')
@ApiTags('Posts') 
export class PostsController {

    constructor(private readonly postsService: PostsService) {
    }

    @Get()
    public getPosts(
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number
    ) {
        return this.postsService.findAll(limit, page);
    }

    @Get(':userId')
    public getPostById(@Param('userId') userId: number) {
        return this.postsService.findAllByUserId(userId);
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
    public createPost(@Body() createPostDto: CreatePostDto) {
        return this.postsService.createPost(createPostDto);
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
