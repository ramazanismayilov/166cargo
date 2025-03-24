import { Type } from "class-transformer";
import { IsString, IsNumber, Min, Max, IsEnum, IsOptional } from "class-validator";
import { TariffCountry } from "src/common/enums/tariffCountry.enum";

export class UpdateTariffDto {
    @Type()
    @IsString()
    @IsEnum(TariffCountry)
    @IsOptional()
    country?: TariffCountry;

    @Type()
    @IsNumber()
    @IsOptional()
    @Min(0)
    weightRangeStart?: number;

    @Type()
    @IsNumber()
    @IsOptional()
    @Min(0)
    @Max(1000)
    weightRangeEnd?: number;

    @Type()
    @IsNumber()
    @IsOptional()
    @Min(0)
    priceUSD?: number;

    @Type()
    @IsNumber()
    @IsOptional()
    @Min(0)
    priceGBP?: number;

    @Type()
    @IsNumber()
    @IsOptional()
    @Min(0)
    priceLocal?: number;

    @Type()
    @IsNumber()
    @IsOptional()
    width?: number;

    @Type()
    @IsNumber()
    @IsOptional()
    height?: number;

    @Type()
    @IsNumber()
    @IsOptional()
    length?: number;
}
