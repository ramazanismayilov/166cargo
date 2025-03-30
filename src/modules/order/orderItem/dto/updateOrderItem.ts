import { PartialType } from "@nestjs/swagger";
import { OrderItemBaseDto } from "./orderItemBase.dto";
import { OrderCountry, OrderCurrency } from "src/common/enums/order.enum";
import { IsEnum, IsOptional } from "class-validator";

export class UpdateOrderItem extends PartialType(OrderItemBaseDto) {
    @IsOptional()
    @IsEnum(OrderCountry)
    country?: OrderCountry;

    @IsOptional()
    @IsEnum(OrderCurrency)
    currency?: OrderCurrency;
}