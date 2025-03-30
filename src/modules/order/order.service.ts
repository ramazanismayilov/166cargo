import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { OrderEntity } from "src/entities/Order.entity";
import { OrderItemEntity } from "src/entities/OrderItem.entity";
import { DataSource, In, Repository } from "typeorm";
import { AddOrderDto } from "./dto/addOrder.dto";
import { UserEntity } from "src/entities/User.entity";
import { ClsService } from "nestjs-cls";
import { MailerService } from "@nestjs-modules/mailer";
import { generateNumber } from "src/common/utils/number.utils";
@Injectable()
export class OrderService {
    private orderRepo: Repository<OrderEntity>
    private userRepo: Repository<UserEntity>
    private orderItemRepo: Repository<OrderItemEntity>

    constructor(
        private cls: ClsService,
        private mailer: MailerService,
        @InjectDataSource() private dataSoruce: DataSource
    ) {
        this.orderRepo = this.dataSoruce.getRepository(OrderEntity)
        this.userRepo = this.dataSoruce.getRepository(UserEntity)
        this.orderItemRepo = this.dataSoruce.getRepository(OrderItemEntity)
    }

    async allOrders() {
        const orders = await this.orderRepo.find({
            order: { id: 'ASC' },
            relations: ['user', 'user.profile', 'orderItems'],
        });

        if (orders.length === 0) throw new NotFoundException('Orders not found');

        return orders.map(order => ({
            ...order,
            user: order.user && order.user.profile
                ? { firstName: order.user.profile.firstName, lastName: order.user.profile.lastName }
                : null
        }));
    }

    async addOrder(params: AddOrderDto) {
        let user = this.cls.get<UserEntity>("user");

        const orderIds = params.orderItems || [];
        const orderItems = orderIds.length > 0
            ? await this.orderItemRepo.find({ where: { id: In(orderIds) } })
            : [];
        if (orderItems.length !== orderIds.length) throw new NotFoundException({ message: "Some orders were not found. Please check order item IDs." });

        const totalPrice = orderItems.reduce((sum, item) => sum + Number(item.productPrice), 0);

        const order = this.orderRepo.create({
            user,
            address: params.address,
            orderItems,
            totalPrice,
            trackingNumber: generateNumber(),
        });

        await this.orderRepo.save(order);

        await this.mailer.sendMail({
            to: user.email,
            subject: '📦 Order Confirmation - 166 Cargo',
            template: 'order-confirmation',
            context: {
                firstName: user.profile?.firstName,
                trackingNumber: order.trackingNumber,
                totalPrice: order.totalPrice.toFixed(2),
                currency: order.orderItems[0].currency,
                orderItems: order.orderItems.map(item => ({
                    productUrl: item.productUrl,
                    quantity: item.quantity,
                    color: item.color,
                    price: item.productPrice,
                    currency: item.currency,
                })),
            },
        });

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