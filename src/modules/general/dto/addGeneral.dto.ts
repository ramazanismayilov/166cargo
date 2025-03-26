import { Type } from "class-transformer";
import { IsString, IsNotEmpty, IsUUID, IsEmail } from "class-validator";

export class AddGeneralDto {
    @Type()
    @IsString()
    @IsNotEmpty()
    @IsUUID('4', { each: true })
    logoId: string;

    @Type()
    @IsString()
    @IsNotEmpty()
    sitename: string;

    @Type()
    @IsString()
    @IsNotEmpty()
    phone: string;

    @Type()
    @IsString()
    @IsNotEmpty()
    location: string;

    @Type()
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @Type()
    @IsString()
    @IsNotEmpty()
    workTime: string;
}
