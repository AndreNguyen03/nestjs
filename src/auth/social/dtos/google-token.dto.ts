import { IsNotEmpty, IsString } from "class-validator";

export class GoogleTokenDto {
    @IsNotEmpty()
    @IsString()
    token: string;
}