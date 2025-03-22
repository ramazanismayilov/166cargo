import { Type } from "class-transformer";
import { IsString } from "class-validator";

export class StationBaseDto {
    @Type()
    @IsString()
    name: string;
}
