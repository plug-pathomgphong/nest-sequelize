import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreatePostDto{
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    title: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    description: string;
}