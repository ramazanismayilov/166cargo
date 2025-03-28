import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsArray, IsUUID, IsOptional, IsInt } from 'class-validator';

export class AddCategoryDto {
    @Type()
    @IsNotEmpty()
    @IsString()
    name: string;

    @Type()
    @IsString()
    @IsNotEmpty()
    @IsUUID('4', { each: true })
    imageId: string;

    @ApiProperty({ example: [2] })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true }) 
    stores?: number[];
}
