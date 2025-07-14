import {  IsNotEmpty, IsObject } from "class-validator";

export class CreatePostMetaOptionsDto {
    @IsNotEmpty()
    @IsObject()
    metaValue: object;
}