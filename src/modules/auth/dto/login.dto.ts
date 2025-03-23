import { Type } from "class-transformer";
import { IsEmail, IsOptional, IsString, Length } from "class-validator";

export class LoginDto {
    @Type()
    @IsOptional()
    @IsString()
    @IsEmail()
    email?: string

    @Type()
    @IsString()
    @Length(6, 12)
    password: string;
}