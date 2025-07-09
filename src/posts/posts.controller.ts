import { Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { PostsService } from './providers/posts.service';

@Controller('posts')
export class PostsController {

    constructor(private readonly postsService: PostsService) {
        // You can inject services here if needed
    }

    @Get()
    public getPosts(
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number
    ) {
        return this.postsService.findAll(limit, page);
    }

    @Get(':userId')
    public getPostById(@Param('userId') userId: string) {
        return this.postsService.findAllByUserId(userId);
    }
}
