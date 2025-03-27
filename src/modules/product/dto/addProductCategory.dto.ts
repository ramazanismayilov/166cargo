import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsNumber, IsArray, IsUUID } from 'class-validator';

export class AddProductCategoryDto {
    @Type()
    @IsNotEmpty()
    @IsString()
    name: string;

    @Type()
    @IsString()
    @IsNotEmpty()
    @IsUUID('4', { each: true })
    imageId: string;

    @Type()
    @ApiProperty({
        example: [2],
    })
    @IsNotEmpty()
    @IsArray()
    stores: { storeId: number}[];
}
