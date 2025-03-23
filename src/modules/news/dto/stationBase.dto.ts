import { Type } from "class-transformer";
import { IsString, IsNotEmpty } from "class-validator";

export class NewsBaseDto {
    @Type()
    @IsString()
    @IsNotEmpty()
    image: string;

    @Type()
    @IsString()
    @IsNotEmpty()
    title: string;

    @Type()
    @IsString()
    @IsNotEmpty()
    description: string;
}
