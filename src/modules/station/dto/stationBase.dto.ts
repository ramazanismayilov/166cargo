import { Type } from "class-transformer";
import { IsString, IsNotEmpty } from "class-validator";

export class StationBaseDto {
    @Type()
    @IsString()
    @IsNotEmpty()
    name: string;

    @Type()
    @IsString()
    @IsNotEmpty()
    address: string;

    @Type()
    @IsString()
    @IsNotEmpty()
    workWeekdays: string;

    @Type()
    @IsString()
    @IsNotEmpty()
    workSaturday: string;

    @Type()
    @IsString()
    @IsNotEmpty()
    workSunday: string;

    @Type()
    @IsString()
    @IsNotEmpty()
    phone: string;
}
