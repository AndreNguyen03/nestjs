import { Body, Controller, Inject, Post } from '@nestjs/common';
import { CreatePostMetaOptionsDto } from './dtos/create-post-metaoptions.dto';
import { MetaOptionsService } from './providers/meta-options.service';

@Controller('meta-options')
export class MetaOptionsController {

    constructor(
        /**
         * Inject MetaOption Service
         */
        private readonly metaOptionsService: MetaOptionsService
    ) {}

    @Post()
    public create(@Body() createPostMetaOptionsDto: CreatePostMetaOptionsDto) {
        return this.metaOptionsService.create(createPostMetaOptionsDto);
    }
}
