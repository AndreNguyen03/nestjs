import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';

@Injectable()
export class PostsService {

    constructor(private readonly usersService: UsersService) { }

    private posts = [
        { id: '1', title: 'Post 1', content: 'Content of Post 1' },
        { id: '2', title: 'Post 2', content: 'Content of Post 2' },
        { id: '3', title: 'Post 3', content: 'Content of Post 3' },
    ];

    public findAllByUserId(userId: string) {

        const user = this.usersService.findOneById(userId);
        if (!user) {
            throw new Error(`User with id ${userId} not found`);
        }

        const posts = this.posts.map(post => {
            return {
                ...post,
                user: user
            }
        })
        console.log(`Post with userId: ${JSON.stringify(posts)}`);
        return posts;
    }
    public findAll(limit: number, page: number) {
        console.log(this.posts);
        return this.posts;
    }
}
