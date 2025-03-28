import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { OrderItemEntity } from "src/entities/OrderItem.entity";
import { DataSource, Repository } from "typeorm";
import { AddOrderItemDto } from "./dto/addOrderItem.dto";

@Injectable()
export class OrderService {
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
        const orderItem = this.orderItemRepo.create(params);
        await this.orderItemRepo.save(orderItem);

        return ({ message: "OrderItem created successfully", orderItem })
    }
}