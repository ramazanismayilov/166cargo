import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { OrderItemEntity } from "src/entities/OrderItem.entity";
import { DataSource, In, Repository } from "typeorm";
import { AddOrderItemDto } from "./dto/addOrderItem.dto";
import { validateOrderCountry } from "src/common/utils/orderItem.utils";
import { OrderCurrency, OrderStatus } from "src/common/enums/order.enum";
import { roundToDecimal } from "src/common/utils/number.utils";
import { UpdateOrderItem } from "./dto/updateOrderItem";
import { OrderEntity } from "src/entities/Order.entity";

@Injectable()
export class OrderItemService {
    private orderItemRepo: Repository<OrderItemEntity>
    private orderRepo: Repository<OrderEntity>

    constructor(
        @InjectDataSource() private dataSoruce: DataSource
    ) {
        this.orderItemRepo = this.dataSoruce.getRepository(OrderItemEntity)
        this.orderRepo = this.dataSoruce.getRepository(OrderEntity)
    }

    async allOrderItems() {
        const orderItems = await this.orderItemRepo.find({ order: { id: 'ASC' } });
        if (orderItems.length === 0) throw new NotFoundException('OrderItems not found');

        return orderItems;
    }

    async addOrderItem(params: AddOrderItemDto) {
        validateOrderCountry(params.country, params.currency);

        const totalPrice = params.productPrice * params.quantity;
        let localPrice: number = totalPrice;

        if (params.currency === OrderCurrency.TRY) localPrice = roundToDecimal(totalPrice * 0.044);
        if (params.currency === OrderCurrency.USD) localPrice = roundToDecimal(totalPrice * 1.70);

        const orderItem = this.orderItemRepo.create({ ...params, totalPrice, localPrice });
        await this.orderItemRepo.save(orderItem);

        return { message: "OrderItem created successfully", orderItem };
    }

    async updateOrderItem(orderItemId: number, params: UpdateOrderItem) {
        let orderItem = await this.orderItemRepo.findOne({ where: { id: orderItemId } });
        if (!orderItem) throw new NotFoundException({ message: 'OrderItem not found' });

        validateOrderCountry(params.country, params.currency);

        const updatedProductPrice = params.productPrice ?? orderItem.productPrice;
        const updatedQuantity = params.quantity ?? orderItem.quantity;

        const totalPrice = updatedProductPrice * updatedQuantity;
        let localPrice: number = totalPrice;

        const currency = params.currency ?? orderItem.currency;

        if (currency === OrderCurrency.TRY) localPrice = roundToDecimal(totalPrice * 0.044);
        if (currency === OrderCurrency.USD) localPrice = roundToDecimal(totalPrice * 1.70);

        await this.orderItemRepo.update(orderItemId, {
            ...params,
            totalPrice,
            localPrice,
        });

        orderItem = await this.orderItemRepo.findOne({ where: { id: orderItemId } });

        return { message: "OrderItem updated successfully", orderItem };
    }

    async deleteOrderItem(orderItemId: number) {
        let orderItem = await this.orderItemRepo.findOne({ where: { id: orderItemId }, relations: ['order'] });
        if (!orderItem) throw new NotFoundException({ message: 'OrderItem not found' });

        let order = orderItem.order;
        if (!order) throw new NotFoundException({ message: 'Order not found' });

        if (order.status !== OrderStatus.PENDING) throw new BadRequestException({ message: 'Order status is not pending, cannot delete the item' });

        let orderItems = await this.orderItemRepo.find({ where: { order: { id: order.id } } });

        if (orderItems.length === 1) {
            await this.orderRepo.delete(order.id);
        } else {
            await this.orderItemRepo.delete(orderItemId);
        }

        return { message: "OrderItem deleted successfully" };
    }
}