import { Type } from "class-transformer";
import { IsDate, IsEnum, IsNumber, IsOptional, IsString, Length } from "class-validator";
import { Gender } from "src/common/enums/gender.enum";
import { IdSerialPrefix } from "src/common/enums/idSerialNumber.enum";
import { Nationality } from "src/common/enums/nationality.enum";
import { PhonePrefix } from "src/common/enums/phone.enum";

export class  ProfileUpdateDto{
    @Type()
    @IsEnum(PhonePrefix)
    @IsOptional()
    phonePrefix?: PhonePrefix

    @Type()
    @IsString()
    @Length(7, 7)
    @IsOptional()
    phone?: string

    @Type()
    @IsEnum(Gender)
    @IsOptional()
    gender?: Gender

    @Type(() => Date)
    @IsDate()
    @IsOptional()
    birthDate?: Date

    @Type()
    @IsEnum(Nationality)
    @IsOptional()
    nationality?: Nationality

    @Type()
    @IsEnum(IdSerialPrefix)
    @IsOptional()
    idSerialPrefix?: IdSerialPrefix

    @Type()
    @IsString()
    @Length(7, 7)
    @IsOptional()
    idSerialNumber?: string

    @Type()
    @IsNumber()
    @IsOptional()
    stationId?: number

    @Type()
    @IsString()
    @IsOptional()
    address?: string

    @Type()
    @IsString()
    @IsOptional()
    voen?: string;
}