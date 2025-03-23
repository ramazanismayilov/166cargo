import { NewsBaseDto } from "./stationBase.dto";
import { IsOptional } from "class-validator";

export class UpdateStationDto extends NewsBaseDto {
    @IsOptional()
    image: string;

    @IsOptional()
    title: string;

    @IsOptional()
    description: string;
}
