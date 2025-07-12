import {  IsNotEmpty, IsObject, IsString } from "class-validator";

export class CreatePostMetaOptionsDto {
    @IsNotEmpty()
    @IsObject()
    metaValue: object;
}