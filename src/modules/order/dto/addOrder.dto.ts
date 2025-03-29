import { IsArray, IsEnum, IsInt, IsNumber, IsString } from "class-validator";
import { Type } from "class-transformer";
import { OrderStatus } from "src/common/enums/order.enum";
import { ApiProperty } from "@nestjs/swagger";

export class AddOrderDto {
    @Type()
    @IsString()
    address: string;

    @ApiProperty({ example: [2] })
    @IsArray()
    @IsInt({ each: true })
    orderItems: number[];

    @Type()
    @IsNumber()
    totalPrice: number;

    @Type()
    @IsEnum(OrderStatus)
    status: OrderStatus;
}
