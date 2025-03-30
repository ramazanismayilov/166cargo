import { IsArray, IsInt, IsNumber, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class OrderBaseDto {
    @Type()
    @IsString()
    address: string;

    @ApiProperty({ example: [2] })
    @IsArray()
    @IsInt({ each: true })
    orderItems: number[];

    @Type()
    @IsNumber()
    @IsOptional()
    promoCode: number
}