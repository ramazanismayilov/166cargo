import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { OrderEntity } from "src/entities/Order.entity";
import { OrderItemEntity } from "src/entities/OrderItem.entity";
import { DataSource, In, Repository } from "typeorm";
import { AddOrderDto } from "./dto/addOrder.dto";
import { UserEntity } from "src/entities/User.entity";
import { ClsService } from "nestjs-cls";
import { MailerService } from "@nestjs-modules/mailer";
import { generateNumber } from "src/common/utils/number.utils";
import { OrderStatus } from "src/common/enums/order.enum";
import { OrderStatusDto } from "./dto/orderStatus.dto";
import { IsDeclaredDto } from "./dto/isDeclared.dto";
import { UpdateOrderDto } from "./dto/updateOrder.dto";
@Injectable()
export class OrderService {
    private userRepo: Repository<UserEntity>
    private orderRepo: Repository<OrderEntity>
    private orderItemRepo: Repository<OrderItemEntity>

    constructor(
        private cls: ClsService,
        private mailer: MailerService,
        @InjectDataSource() private dataSoruce: DataSource
    ) {
        this.userRepo = this.dataSoruce.getRepository(UserEntity)
        this.orderRepo = this.dataSoruce.getRepository(OrderEntity)
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

        const orderIds = params.orderItems;
        const orderItems = orderIds.length > 0
            ? await this.orderItemRepo.find({ where: { id: In(orderIds) } })
            : [];
        if (orderItems.length !== orderIds.length) throw new NotFoundException({ message: "Some orders were not found. Please check order item IDs." });

        let totalPrice = orderItems.reduce((sum, item) => sum + Number(item.localPrice), 0);

        const userOrders = await this.orderRepo.find({ where: { user } });
        const isFirstOrder = userOrders.length === 0;
        if (params.promoCode != user.profile.promoCode) throw new BadRequestException({ message: 'Promo code is invalid. Please check and try again.' })

        if (user.profile.balance > totalPrice && isFirstOrder && user.profile.promoCode) {
            const discount = 0.5;
            totalPrice = totalPrice * (1 - discount);

            user.profile.promoCode = null;
            await this.userRepo.save(user);
        }

        if (user.profile.balance < totalPrice) throw new BadRequestException({ message: "Insufficient balance to complete the purchase." });

        const order = this.orderRepo.create({
            user,
            address: params.address,
            orderItems,
            totalPrice,
            trackingNumber: generateNumber(),
        });
        await this.orderRepo.save(order);

        user.profile.balance -= totalPrice;
        await this.userRepo.save(user);

        const updatedOrderItems = orderItems.map(item => ({
            ...item,
            orderId: order.id,
        }));
        await this.orderItemRepo.save(updatedOrderItems);

        await this.mailer.sendMail({
            to: user.email,
            subject: '📦 Order Confirmation - 166 Cargo',
            template: 'order-confirmation',
            context: {
                firstName: user.profile.firstName,
                trackingNumber: order.trackingNumber,
                totalPrice: order.totalPrice,
                shippingAddress: order.address,
                currency: 'AZN',
                orderItems: order.orderItems.map(item => ({
                    productUrl: item.productUrl,
                    quantity: item.quantity,
                    color: item.color,
                    price: item.productPrice,
                    currency: item.currency,
                    status: order.status,
                })),
            },
        });

        return {
            message: "Order has been successfully processed",
            order: {
                ...order,
                user: {
                    firstName: user.profile?.firstName,
                    lastName: user.profile?.lastName
                }
            }
        };
    }

    async updateOrder(orderId: number, params: UpdateOrderDto) {
        let order = await this.orderRepo.findOne({ where: { id: orderId } });
        if (!order) throw new NotFoundException({ message: 'Order not found' });
        
        if (order.status !== OrderStatus.PENDING) throw new BadRequestException({ message: 'Order status is not pending, cannot update the item' });

        await this.orderRepo.update(orderId, params);

        order = await this.orderRepo.findOne({ where: { id: orderId } });

        return { message: 'Order updated successfully', order };
    }


    async deleteOrder(orderId: number) {
        let order = await this.orderRepo.findOne({ where: { id: orderId } });
        if (!order) throw new NotFoundException({ message: 'Order not found' });

        if (order.status !== OrderStatus.PENDING) throw new BadRequestException({ message: 'Order status is not pending, cannot delete the item' });

        await this.orderRepo.delete(orderId)
        return ({ message: "Order deleted successfully" })
    }

    async statusChange(trackingNumber: number, params: OrderStatusDto) {
        let user = this.cls.get<UserEntity>("user");

        let order = await this.orderRepo.findOne({ where: { trackingNumber: trackingNumber } });
        if (!order) throw new NotFoundException({ message: "Order not found. Please try again!" });

        const currentStatus = order.status;
        const newStatus = params.status;

        const validTransitions: Record<OrderStatus, OrderStatus[]> = {
            [OrderStatus.PENDING]: [OrderStatus.SHIPPED, OrderStatus.CANCELED],
            [OrderStatus.SHIPPED]: [OrderStatus.INTRANSIT, OrderStatus.CANCELED],
            [OrderStatus.INTRANSIT]: [OrderStatus.READYFORPICKUP, OrderStatus.CANCELED],
            [OrderStatus.READYFORPICKUP]: [OrderStatus.DELIVERED, OrderStatus.CANCELED],
            [OrderStatus.DELIVERED]: [],
            [OrderStatus.CANCELED]: [OrderStatus.PENDING, OrderStatus.SHIPPED, OrderStatus.INTRANSIT, OrderStatus.READYFORPICKUP, OrderStatus.DELIVERED],
        };

        if (!validTransitions[currentStatus].includes(newStatus)) {
            throw new BadRequestException({ message: `Order cannot be moved from ${currentStatus} to ${newStatus}` });
        }

        if (currentStatus === OrderStatus.INTRANSIT && newStatus === OrderStatus.READYFORPICKUP && !order.isDeclared) {
            throw new BadRequestException({ message: 'Please state your package before moving to Ready for Pickup' });
        }

        order.status = newStatus;
        await this.orderRepo.save(order);

        await this.mailer.sendMail({
            to: user.email,
            subject: '📦 Order Status - 166 Cargo',
            template: 'order-status',
            context: {
                firstName: user.profile.firstName,
                trackingNumber: order.trackingNumber,
                status: order.status,
            },
        });

        return { message: "Order status updated successfully", order };
    }

    async isDeclared(trackingNumber: number, params: IsDeclaredDto) {
        let order = await this.orderRepo.findOne({ where: { trackingNumber: trackingNumber } });
        if (!order) throw new NotFoundException({ message: "Order not found. Please try again!" });

        if (order.status !== OrderStatus.INTRANSIT) throw new BadRequestException({ message: 'The order must be in INTRANSIT status to be declared.' });

        order.isDeclared = true;
        await this.orderRepo.save(order);

        return { message: 'The closure has been successfully declared.' };
    }
}