import { Type } from "class-transformer";
import { IsString, IsNumber, IsNotEmpty, IsEnum } from "class-validator";
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
    weight: number;

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
}
