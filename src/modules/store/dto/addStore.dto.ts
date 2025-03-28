import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class AddStoreDto {
    @Type()
    @IsNotEmpty()
    @IsString()
    name: string;

    @Type()
    @IsNotEmpty()
    @IsString()
    storeUrl: string;

    @Type()
    @IsString()
    @IsNotEmpty()
    @IsUUID('4', { each: true })
    imageId: string;
}
