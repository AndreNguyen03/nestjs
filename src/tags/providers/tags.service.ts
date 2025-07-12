import { Injectable } from '@nestjs/common';
import { CreateTagDto } from '../dtos/create-tag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from '../tag.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class TagsService {

    constructor(
        @InjectRepository(Tag)
        private readonly tagsRepository: Repository<Tag>
    ) { }

    public async createTag(createTagDto: CreateTagDto) {
        let tag = this.tagsRepository.create(createTagDto);

        return await this.tagsRepository.save(tag);
    }

    public async findMultipleTags(tagIds: number[]) {
        console.log(`TagIds, service`, tagIds)
        let tags = await this.tagsRepository.find({
            where: {
                id: In(tagIds)
            }
        });

        console.log(`tags find`, tags)
        return tags;
    }

    public async deleteTag(tagId: number) {
        await this.tagsRepository.delete({ id: tagId });
        return { deleted: true, tagId }
    }

    public async softDeleteTag(tagId: number) {
        await this.tagsRepository.softDelete({ id: tagId })
        return {
            deleted: true,
            tagId
        }
    }
}
