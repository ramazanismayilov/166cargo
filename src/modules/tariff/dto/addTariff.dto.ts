import { Type } from "class-transformer";
import { IsString, IsNumber, Min, Max, IsNotEmpty, IsEnum } from "class-validator";
import { TariffCountry } from "src/common/enums/tariffCountry.enum";

export class AddTariffDto {
    @Type()
    @IsString()
    @IsEnum(TariffCountry)
    @IsNotEmpty()
    country: TariffCountry;

    @Type()
    @IsNumber()
    @IsNotEmpty()
    width: number;

    @Type()
    @IsNumber()
    @IsNotEmpty()
    height: number;

    @Type()
    @IsNumber()
    @IsNotEmpty()
    length: number;

    @Type()
    @IsNumber()
    @IsNotEmpty()
    weightRangeStart: number;

    @Type()
    @IsNumber()
    @IsNotEmpty()
    weightRangeEnd: number;

    @Type()
    @IsNumber()
    @IsNotEmpty()
    priceUSD: number;

    @Type()
    @IsNumber()
    @IsNotEmpty()
    priceGBP: number;
}
