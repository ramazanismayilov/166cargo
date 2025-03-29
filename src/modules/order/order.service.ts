import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { OrderEntity } from "src/entities/Order.entity";
import { OrderItemEntity } from "src/entities/OrderItem.entity";
import { DataSource, In, Repository } from "typeorm";
import { AddOrderDto } from "./dto/addOrder.dto";
import { UserEntity } from "src/entities/User.entity";
import { ClsService } from "nestjs-cls";
import { v4 } from "uuid";
import { generateCustomerNumber } from "src/common/utils/customerNumber.utils";
@Injectable()
export class OrderService {
    private orderRepo: Repository<OrderEntity>
    private userRepo: Repository<UserEntity>
    private orderItemRepo: Repository<OrderItemEntity>

    constructor(
        private cls: ClsService,
        @InjectDataSource() private dataSoruce: DataSource
    ) {
        this.orderRepo = this.dataSoruce.getRepository(OrderEntity)
        this.userRepo = this.dataSoruce.getRepository(UserEntity)
        this.orderItemRepo = this.dataSoruce.getRepository(OrderItemEntity)
    }

    async allOrders() {
        const orders = await this.orderRepo.find({ order: { id: 'ASC' }, relations: ['user', 'orderItems'] });
        if (orders.length === 0) throw new NotFoundException('Orders not found');

        return orders;
    }

    async addOrder(params: AddOrderDto) {
        let user = this.cls.get<UserEntity>("user");

        const orderIds = params.orderItems || [];
        const orderItems = orderIds.length > 0
            ? await this.orderItemRepo.find({ where: { id: In(orderIds) } })
            : [];
        if (orderItems.length !== orderIds.length) throw new NotFoundException({ message: "Some orders were not found. Please check order item IDs." });

        const order = this.orderRepo.create({
            user,
            address: params.address,
            orderItems,
            status: params.status
        });

        await this.orderRepo.save(order);
        return {
            message: "Order created successfully",
            order: {
                ...order,
                user: {
                    firstName: user.profile?.firstName,
                    lastName: user.profile?.lastName
                }
            }
        };
    }

    async deleteOrder(orderId: number) {
        let order = await this.orderRepo.findOne({ where: { id: orderId } });
        if (!order) throw new NotFoundException({ message: 'Order not found' });

        await this.orderRepo.delete(orderId)
        return ({ message: "Order deleted successfully" })
    }
}

// async updateOrder(orderItemId: number, params: UpdateOrderItem) {
//     let orderItem = await this.orderItemRepo.findOne({ where: { id: orderItemId } });
//     if (!orderItem) throw new NotFoundException({ message: 'OrderItem not found' });

//     await this.orderItemRepo.update(orderItemId, params);
//     orderItem = await this.orderItemRepo.findOne({ where: { id: orderItemId } });
//     return { message: "OrderItem updated successfully", orderItem };
// }

