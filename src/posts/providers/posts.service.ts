import { Body, Injectable } from '@nestjs/common';
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
        private readonly tagsService: TagsService
    ) { }



    public async findAllByUserId(userId: number) {
        const user = this.usersService.findOneById(userId);

        let posts = await this.postsRepository.find({
            relations: {
                metaOptions: true,
            }
        })

        return posts;
    }
    public async findAll(limit: number, page: number) {
        let posts = await this.postsRepository.find({
            relations: {
                metaOptions: true,
                tags: true
            }
        })

        return posts;
    }

    public async createPost(@Body() createPostDto: CreatePostDto) {
        // find author from database based on authorId
        let author = await this.usersService.findOneById(createPostDto.authorId);

        let tagIds: number[] | undefined = createPostDto.tags;

        let tags: Tag[] | undefined = undefined;

        if (tagIds) {
            tags = await this.tagsService.findMultipleTags(tagIds)
        }

        if (!author) {
            throw new Error('Author not found');
        }
        let post = this.postsRepository.create({ ...createPostDto, author: author, tags: tags });

        return await this.postsRepository.save(post);
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
        console.log(tagIds)
        let tags: Tag[] | undefined = undefined;

        if (tagIds) {
            tags = await this.tagsService.findMultipleTags(tagIds)
            console.log(tags)
        }

        // find the post
        let post: Post | null  = await this.postsRepository.findOneBy({
            id: patchPostDto.id
        })

        // update the properties
        if (post) {
            post.title = patchPostDto.title ?? post.title;
            post.content = patchPostDto.content ?? post.content;
            post.status = patchPostDto.status ?? post.status;
            post.postType = patchPostDto.postType ?? post.postType;
            post.slug = patchPostDto.slug ?? post.slug;
            post.featuredImageUrl = patchPostDto.featuredImageUrl ?? post.featuredImageUrl;
            post.publishOn = patchPostDto.publishOn ?? post.publishOn
            // assign the new tags
            post.tags = tags;

            return this.postsRepository.save(post)
        }

        // save the post and return
        return Error(`Post id:${patchPostDto.id}, title: ${patchPostDto.title} not found`);
    }
}
