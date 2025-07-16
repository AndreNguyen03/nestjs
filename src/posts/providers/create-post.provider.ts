import { BadRequestException, Body, ConflictException, Injectable } from '@nestjs/common';
import { CreatePostDto } from '../dtos/create-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../post.entity';
import { Repository } from 'typeorm';
import { TagsService } from 'src/tags/providers/tags.service';
import { UsersService } from 'src/users/providers/users.service';
import { Tag } from 'src/tags/tag.entity';
import { ActiveUserData } from 'src/auth/interface/active-user-data.interface';
import { User } from 'src/users/user.entity';

@Injectable()
export class CreatePostProvider {

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
        private readonly tagsService: TagsService,
    ) { }

    public async create(createPostDto: CreatePostDto, user: ActiveUserData) {

        let tagIds: number[] | undefined = createPostDto.tags;

        let tags: Tag[] | undefined = undefined;
        let author: User | undefined = undefined;
        try {
            // find author from database based on authorId
            author = await this.usersService.findOneById(user.sub);

            if (tagIds) {
                tags = await this.tagsService.findMultipleTags(tagIds)
            }
        } catch (error) {
            throw new ConflictException(error);
        }

        if (createPostDto.tags?.length !== tags?.length) {
            throw new BadRequestException('Please check your tag id')
        }

        let post = this.postsRepository.create({ ...createPostDto, author: author, tags: tags });

        try {
            return await this.postsRepository.save(post);
        } catch (error) {
            throw new ConflictException(error, {
                description: 'Ensure post is unique and not a duplicate'
            })
        }
    }
}
