import { Type } from "class-transformer";
import { IsDate, IsEmail, IsEnum, IsNumber, IsOptional, IsString, Length, ValidateIf } from "class-validator";
import { Gender } from "src/common/enums/gender.enum";
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
    @IsOptional()
    @IsString()
    @IsEmail()
    email?: string

    @Type()
    @IsEnum(PhonePrefix)
    phonePrefix: PhonePrefix

    @Type()
    @IsOptional()
    @IsString()
    @Length(6, 15)
    phone?: string

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
    @IsString()
    idSerialNumber: string

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

    @ValidateIf((o) => o.password !== o.repeatPassword)
    @IsString({ message: "Passwords do not match" })
    repeatPassword: string;

    @Type()
    @IsString()
    @IsOptional()
    voen?: string;
}