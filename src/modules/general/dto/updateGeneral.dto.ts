import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { AddGeneralDto } from "./addGeneral.dto";
import { Type } from "class-transformer";

export class UpdateGeneralDto {
    @Type()
    @IsString()
    @IsNotEmpty()
    @IsUUID('4', { each: true })
    @IsOptional()
    logoId?: string;

    @Type()
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    sitename?: string;

    @Type()
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    phone?: string;

    @Type()
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    location?: string;

    @Type()
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    @IsOptional()
    email?: string;

    @Type()
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    workTime?: string;
}
