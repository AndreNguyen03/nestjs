import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsInt, IsNotEmpty } from "class-validator";
import { CreatePostDto } from "./create-post.dto";

export class PatchPostDto extends PartialType(CreatePostDto) {
    @ApiProperty({
        description: 'The unique identifier of the post to be updated',
        example: 1,
        required: true,
    })
    @IsInt()
    @IsNotEmpty()
    id: number;
}