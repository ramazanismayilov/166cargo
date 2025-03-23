import { Type } from "class-transformer";
import { IsDate, IsEmail, IsEnum, IsNumber, IsOptional, IsString, Length } from "class-validator";
import { Gender } from "src/common/enums/gender.enum";
import { IdSerialNumber } from "src/common/enums/idSerialNumber.enum";
import { Nationality } from "src/common/enums/nationality.enum";
import { PhonePrefix } from "src/common/enums/phone.enum";
import { UserType } from "src/common/enums/user.enum";

export class RegisterDto {
    @Type()
    @IsString()
    firstName: string

    @Type()
    @IsString()
    lastName: string

    @Type()
    @IsString()
    @IsEmail()
    email: string

    @Type()
    @IsEnum(PhonePrefix)
    phonePrefix: PhonePrefix

    @Type()
    @IsString()
    @Length(7, 7)
    phone: string

    @Type()
    @IsEnum(Gender)
    gender: Gender

    @Type(() => Date)
    @IsDate()
    birthDate: Date

    @Type()
    @IsEnum(Nationality)
    nationality: Nationality

    @Type()
    @IsEnum(UserType)
    userType: UserType

    @Type()
    @IsEnum(IdSerialNumber)
    idSerialNumber: IdSerialNumber

    @Type()
    @IsString()
    idFinCode: string

    @Type()
    @IsNumber()
    stationId: number

    @Type()
    @IsString()
    address: string

    @Type()
    @IsString()
    @Length(6, 12)
    password: string;

    @Type()
    @IsString()
    @Length(6, 12)
    repeatPassword: string;

    @Type()
    @IsString()
    @IsOptional()
    voen?: string;
}