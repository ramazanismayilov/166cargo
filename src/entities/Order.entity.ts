import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./User.entity";
import { OrderItem } from "./OrderItem.entity";
import { Shipping } from "./Shipping.entity";

@Entity('order')
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserEntity, (user) => user.orders)
    user: UserEntity;

    @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
    items: OrderItem[];

    @OneToOne(() => Shipping, (shipping) => shipping.order)
    shipping: Shipping;

    @Column()
    totalPrice: number;

    @Column({ default: 'pending' })
    status: 'pending' | 'shipped' | 'delivered' | 'cancelled';

    @CreateDateColumn()
    createdAt: Date;
}
