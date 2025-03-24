import { IsOptional } from "class-validator";
import { NewsBaseDto } from "./newsBase.dto";

export class UpdateNewsDto extends NewsBaseDto {
    @IsOptional()
    imageId: string;

    @IsOptional()
    title: string;

    @IsOptional()
    description: string;
}
