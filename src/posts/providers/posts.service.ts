import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto  } from '../dtos/create-post.dto';
import { postType } from '../enums/postType.enum';
import { postStatus } from '../enums/postStatus.enum';

@Injectable()
export class PostsService {

    constructor(private readonly usersService: UsersService) { }

    private posts = [
        {
            id: '1',
            title: 'First Post',
            postType: postType.POST,
            slug: 'first-post',
            status: postStatus.PUBLISHED,
            content: 'This is the first post.',
            schema: '{}',
            featuredImageUrl: 'https://example.com/image1.jpg',
            publishOn: new Date('2024-07-01T10:00:00Z'),
            tags: ['nestjs', 'typescript'],
            metaOptions: [{ author: 'John Doe' }]
        },
        {
            id: '2',
            title: 'Second Page',
            postType: postType.PAGE,
            slug: 'second-page',
            status: postStatus.DRAFT,
            content: 'This is a draft page.',
            schema: '{}',
            featuredImageUrl: 'https://example.com/image2.jpg',
            publishOn: new Date('2024-07-02T12:00:00Z'),
            tags: ['page', 'draft'],
            metaOptions: [{ author: 'Jane Smith' }]
        }
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
