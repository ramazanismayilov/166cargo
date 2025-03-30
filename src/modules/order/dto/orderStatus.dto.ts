import { Type } from "class-transformer";
import { IsEnum } from "class-validator";
import { OrderStatus } from "src/common/enums/order.enum";

export class OrderStatusDto {
    @Type()
    @IsEnum(OrderStatus)
    status: OrderStatus
}