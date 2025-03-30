import { Type } from "class-transformer";
import { IsBoolean } from "class-validator";

export class IsDeclaredDto {
    @Type()
    @IsBoolean()
    isDeclared: boolean
}