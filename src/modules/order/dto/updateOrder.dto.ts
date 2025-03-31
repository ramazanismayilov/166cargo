import { Type } from "class-transformer";
import { IsString } from "class-validator";

export class UpdateOrderDto {
    @Type() 
    @IsString()
    address: string;
}
