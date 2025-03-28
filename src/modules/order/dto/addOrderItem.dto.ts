import { IsInt, IsString, IsEnum, Min, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { Size } from 'src/common/enums/size.enum';
import { Color } from 'src/common/enums/color.enum';
import { OrderCountry, OrderCurrency } from 'src/common/enums/order.enum';

export class AddOrderItemDto {
    @Type()
    @IsString()
    productUrl: string;

    @Type()
    @IsNumber()
    @Min(1)
    quantity: number;

    @Type()
    @IsEnum(OrderCurrency)
    currency: OrderCurrency;

    @Type()
    @IsEnum(OrderCountry)
    country: OrderCountry;

    @Type()
    @IsEnum(Size)
    size: Size;

    @Type()
    @IsEnum(Color)
    color: Color;

    @Type()
    @IsNumber()
    productPrice: number;
}
