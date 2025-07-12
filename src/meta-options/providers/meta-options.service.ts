import { Injectable } from '@nestjs/common';
import { CreatePostMetaOptionsDto } from '../dtos/create-post-metaoptions.dto';
import { Repository } from 'typeorm';
import { MetaOption } from '../meta-option.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MetaOptionsService {

    constructor(
        /**
         * Inject MetaOption Repository
         */
        @InjectRepository(MetaOption) private readonly metaOptionsRepository: Repository<MetaOption>
    ) { }

    public async create(CreatePostMetaOptionsDto: CreatePostMetaOptionsDto) {
        let metaOption = this.metaOptionsRepository.create(CreatePostMetaOptionsDto);

        return await this.metaOptionsRepository.save(metaOption);
    }
}
