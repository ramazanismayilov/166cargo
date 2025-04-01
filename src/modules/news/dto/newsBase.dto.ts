import { Type } from "class-transformer";
import { IsString, IsUUID } from "class-validator";

export class NewsBaseDto {
    @Type()
    @IsString()
    @IsUUID('4', { each: true })
    imageId: string;

    @Type()
    @IsString()
    title: string;

    @Type()
    @IsString()
    description: string;
}
