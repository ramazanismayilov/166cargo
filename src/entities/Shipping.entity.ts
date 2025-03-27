import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./Order.entity";

@Entity('shippingEntity')
export class Shipping {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => Order, (order) => order.shipping)
    order: Order;

    @Column()
    address: string;

    @Column({ default: 'processing' })
    status: 'processing' | 'shipped' | 'delivered';

    @Column({ nullable: true })
    trackingNumber?: string;
}
