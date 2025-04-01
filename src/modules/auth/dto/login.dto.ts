import { Type } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class LoginDto {
    @Type()
    @IsEmail()
    @IsNotEmpty()
    email: string

    @Type()
    @IsString()
    @Length(6, 12)
    @IsNotEmpty()
    password: string;
}