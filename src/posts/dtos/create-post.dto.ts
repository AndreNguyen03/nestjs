import { IsArray, IsEnum, IsInt, IsISO8601, IsJSON, IsNotEmpty, IsOptional, IsString, IsUrl, Matches, maxLength, MaxLength, MinLength, ValidateNested } from "class-validator";
import { postType } from "../enums/postType.enum";
import { postStatus } from "../enums/postStatus.enum";
import { CreatePostMetaOptionsDto } from "../../meta-options/dtos/create-post-metaoptions.dto";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Tag } from "src/tags/tag.entity";


export class CreatePostDto {
    @IsString()
    @MinLength(4)
    @IsNotEmpty()
    @MaxLength(512)
    @ApiProperty({
        description: 'Title of the post',
        example: 'My First Post',
        minLength: 4,
        maxLength: 512,
    })
    title: string;

    @ApiProperty({
        description: 'Type of the post',
        enum: postType,
        example: postType.POST,
    })
    @IsEnum(postType)
    @IsNotEmpty()
    postType: postType;

    @ApiProperty({
        description: 'Slug for the post, must be lowercase and can only contain letters, numbers, and hyphens',
        example: 'my-post-slug',
        minLength: 3,
        maxLength: 256,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(256)
    @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        message: 'Slug must be lowercase and can only contain letters, numbers, and hyphens. For example: "my-post-slug"',
    })
    slug: string;

    @ApiProperty({
        description: 'Status of the post',
        enum: postStatus,
        example: postStatus.PUBLISHED,
        default: postStatus.DRAFT,
        required: true,
    })
    @IsEnum(postStatus)
    @IsNotEmpty()
    status: postStatus;

    @ApiPropertyOptional({
        description: 'Content of the post, can be HTML or Markdown',
        example: '<p>This is the content of the post.</p>',
        required: false,
        type: String,
    })
    @IsString()
    @IsOptional()
    content?: string;

    @ApiPropertyOptional({
        description: 'JSON schema for the post, can be used for structured data',
        example: '{"@context": "https://schema.org", "@type": "BlogPosting", "headline": "My First Post"}',
        required: false,
    })
    @IsJSON()
    @IsOptional()
    schema?: string;

    @ApiPropertyOptional({
        description: 'URL of the featured image for the post',
        example: 'https://example.com/image.jpg',
        required: false,
        maxLength: 1024
    })
    @IsUrl()
    @IsOptional()
    @MaxLength(1024)
    featuredImageUrl?: string;

    @ApiPropertyOptional({
        description: 'Date and time when the post should be published, in ISO 8601 format',
        example: '2024-07-01T10:00:00Z',
        required: false,
    })
    @IsISO8601()
    @IsOptional()
    publishOn?: Date;

    @ApiPropertyOptional({
        description: 'Array of ids of tags',
        example: [1, 2],
        required: false,
        type: [Number],
    })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    tags?: number[];

    @ApiPropertyOptional({
        description: 'Meta options for the post, can include additional metadata like author, keywords, etc.',
        type: CreatePostMetaOptionsDto,
        required: false,
        example: {
            metaValue: {
                sidebarEnabled: true,
                author: 'John Doe',
            },
        },
    })
    @IsOptional()
    @ValidateNested()
    @Type(() => CreatePostMetaOptionsDto)
    metaOptions?: CreatePostMetaOptionsDto;
}

