import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { OrderItemEntity } from "src/entities/OrderItem.entity";
import { DataSource, Repository } from "typeorm";
import { AddOrderItemDto } from "./dto/addOrderItem.dto";
import { UpdateOrderItem } from "./dto/updateOrderItem";
import { validateOrderCountry } from "src/common/utils/orderItem.utils";

@Injectable()
export class OrderItemService {
    private orderItemRepo: Repository<OrderItemEntity>

    constructor(
        @InjectDataSource() private dataSoruce: DataSource
    ) {
        this.orderItemRepo = this.dataSoruce.getRepository(OrderItemEntity)
    }

    async allOrderItems() {
        const orderItems = await this.orderItemRepo.find({ order: { id: 'ASC' } });
        if (orderItems.length === 0) throw new NotFoundException('OrderItems not found');

        return orderItems;
    }

    async addOrderItem(params: AddOrderItemDto) {
        validateOrderCountry(params.country, params.currency)
        const orderItem = this.orderItemRepo.create(params);
        await this.orderItemRepo.save(orderItem);
        return { message: "OrderItem created successfully", orderItem };
    }

    async updateOrderItem(orderItemId: number, params: UpdateOrderItem) {
        let orderItem = await this.orderItemRepo.findOne({ where: { id: orderItemId } });
        if (!orderItem) throw new NotFoundException({ message: 'OrderItem not found' });

        validateOrderCountry(params.country, params.currency)

        await this.orderItemRepo.update(orderItemId, params);
        orderItem = await this.orderItemRepo.findOne({ where: { id: orderItemId } });
        return { message: "OrderItem updated successfully", orderItem };
    }

    async deleteOrderItem(orderItemId: number) {
        let orderItem = await this.orderItemRepo.findOne({ where: { id: orderItemId } });
        if (!orderItem) throw new NotFoundException({ message: 'OrderItem not found' });

        await this.orderItemRepo.delete(orderItemId)
        return ({ message: "OrderItem deleted successfully" })
    }
}