import { StationBaseDto } from "./stationBase.dto";
import { IsOptional } from "class-validator";

export class UpdateStationDto extends StationBaseDto {
    @IsOptional()
    name: string;

    @IsOptional()
    address: string;

    @IsOptional()
    workWeekdays: string;

    @IsOptional()
    workSaturday: string;

    @IsOptional()
    workSunday: string;

    @IsOptional()
    phone: string;
}
