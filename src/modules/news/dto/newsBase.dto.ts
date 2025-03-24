import { Type } from "class-transformer";
import { IsString, IsNotEmpty, IsUUID } from "class-validator";

export class NewsBaseDto {
    @Type()
    @IsString()
    @IsNotEmpty()
    @IsUUID('4', { each: true })
    imageId: string;

    @Type()
    @IsString()
    @IsNotEmpty()
    title: string;

    @Type()
    @IsString()
    @IsNotEmpty()
    description: string;
}
