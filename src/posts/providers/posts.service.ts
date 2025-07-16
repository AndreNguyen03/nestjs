import { BadRequestException, Body, Injectable, RequestTimeoutException } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { postType } from '../enums/postType.enum';
import { postStatus } from '../enums/postStatus.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { TagsService } from 'src/tags/providers/tags.service';
import { Tag } from 'src/tags/tag.entity';
import { PatchPostDto } from '../dtos/patch-post.dto';
import { GetPostsDto } from '../dtos/get-posts.dto';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';
import { Paginated } from 'src/common/pagination/interface/paginated.interface';
import { CreatePostProvider } from './create-post.provider';
import { ActiveUserData } from 'src/auth/interface/active-user-data.interface';

@Injectable()
export class PostsService {

    constructor(
        /**
         * Inject User Service
         */
        private readonly usersService: UsersService,
        /**
         * Inject postsRepository
         */
        @InjectRepository(Post)
        private readonly postsRepository: Repository<Post>,
        /**
         * Inject metaOptionsRepository
         */
        @InjectRepository(MetaOption)
        private readonly metaOptionsRepository: Repository<MetaOption>,
        /**
         * Inject tagservice
         */
        private readonly tagsService: TagsService,
        /**
         * Inject pagination provider
         */
        private readonly paginationProvider: PaginationProvider,
        /**
         * Inject create post provider
         */
        private readonly createPostProvider: CreatePostProvider
    ) { }



    public async findAllByUserId(userId: number, postQuery: GetPostsDto) {
        const user = this.usersService.findOneById(userId);

        if (!user) return 'User id not found';

        let posts = await this.postsRepository.find({
            where: {
                author: { id: userId }
            },
            skip: (postQuery.page - 1) * postQuery.limit,
            take: postQuery.limit
        })

        return posts;
    }
    public async findAll(postQuery: GetPostsDto): Promise<Paginated<Post>> {
        let posts = await this.paginationProvider.paginateQuery(
            {
                limit: postQuery.limit,
                page: postQuery.page
            },
            this.postsRepository
        )

        return posts;
    }

    public async createPost(createPostDto: CreatePostDto, user: ActiveUserData) {
        return await this.createPostProvider.create(createPostDto, user);
    }

    public async detelePost(postId: number) {
        // deleting the post
        await this.postsRepository.delete(postId);
        // confirmation
        return { deleted: true, postId }
    }

    public async updatePost(patchPostDto: PatchPostDto) {
        // Find the tags
        const tagIds: number[] | undefined = patchPostDto.tags;
        let tags: Tag[] | undefined = undefined;
        let post: Post | null = null;

        if (tagIds) {
            try {
                tags = await this.tagsService.findMultipleTags(tagIds)
            } catch (error) {
                throw new RequestTimeoutException(
                    'Unable to process your request at the moment , try again later!'
                )
            }
        }

        if (!tags || tags.length !== patchPostDto.tags?.length) {
            throw new BadRequestException(
                'Please check your tag Ids and ensure they are correct'
            )
        }

        // find the post
        try {
            post = await this.postsRepository.findOneBy({
                id: patchPostDto.id
            })
        } catch (error) {
            throw new RequestTimeoutException(
                'Unable to process your request at the moment, try again later!'
            )
        }

        if (!post) {
            throw new BadRequestException(
                'The post ID does not exist'
            )
        }

        // update the properties
        post.title = patchPostDto.title ?? post.title;
        post.content = patchPostDto.content ?? post.content;
        post.status = patchPostDto.status ?? post.status;
        post.postType = patchPostDto.postType ?? post.postType;
        post.slug = patchPostDto.slug ?? post.slug;
        post.featuredImageUrl = patchPostDto.featuredImageUrl ?? post.featuredImageUrl;
        post.publishOn = patchPostDto.publishOn ?? post.publishOn
        // assign the new tags
        post.tags = tags;

        try {
            this.postsRepository.save(post)
        } catch (error) {
            throw new RequestTimeoutException(
                'Unable to process your request at the moment please try later'
            )
        }

        return post;
    }
}
