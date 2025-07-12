import { Body, Controller, Delete, ParseIntPipe, Post, Query } from '@nestjs/common';
import { TagsService } from './providers/tags.service';
import { CreateTagDto } from './dtos/create-tag.dto';

@Controller('tags')
export class TagsController {

    constructor(
        private readonly tagsService: TagsService
    ) { }

    @Post()
    public createTag(@Body() creatTagDto: CreateTagDto) {
        return this.tagsService.createTag(creatTagDto);
    }

    @Delete()
    public deleteTag(@Query('id', ParseIntPipe) id: number) {
        return this.tagsService.deleteTag(id)
    }

    @Delete('soft-delete')
    public softDeleteTag(@Query('id', ParseIntPipe) id: number) {
        return this.tagsService.softDeleteTag(id)
    }
}
