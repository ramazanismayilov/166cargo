import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserEntity } from "./User.entity";
import { OrderItemEntity } from "./OrderItem.entity";
import { ShippingEntity } from "./Shipping.entity";
import { OrderStatus } from "src/common/enums/order.enum";

@Entity('order')
export class OrderEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserEntity, (user) => user.orders)
    user: UserEntity;

    @OneToMany(() => OrderItemEntity, (orderItem) => orderItem.order)
    items: OrderItemEntity[];

    @OneToOne(() => ShippingEntity, (shipping) => shipping.order)
    shipping: ShippingEntity;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    totalPrice: number;

    @Column({ type: 'enum', enum: OrderStatus })
    status: OrderStatus;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
