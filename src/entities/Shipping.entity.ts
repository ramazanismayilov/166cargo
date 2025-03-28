import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { OrderEntity } from "./Order.entity";

@Entity('shipping')
export class ShippingEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => OrderEntity, (order) => order.shipping)
    order: OrderEntity;

    @Column()
    address: string;

    @Column()
    trackingNumber: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
