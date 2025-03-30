import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserEntity } from "./User.entity";
import { OrderItemEntity } from "./OrderItem.entity";
import { OrderStatus } from "src/common/enums/order.enum";

@Entity('order')
export class OrderEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserEntity, (user) => user.orders)
    user: UserEntity;

    @OneToMany(() => OrderItemEntity, (orderItem) => orderItem.order, { cascade: true })
    orderItems: OrderItemEntity[];

    @Column({ type: 'float' })
    totalPrice: number;

    @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
    status: OrderStatus;

    @Column()
    trackingNumber: number

    @Column()
    address: string

    @Column({ default: false })
    isDeclared: boolean

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
