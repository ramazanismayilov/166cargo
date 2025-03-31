import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { OrderEntity } from "./Order.entity";
import { Size } from "src/common/enums/size.enum";
import { Color } from "src/common/enums/color.enum";
import { OrderCountry, OrderCurrency } from "src/common/enums/order.enum";

@Entity('orderItem')
export class OrderItemEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => OrderEntity, (order) => order.orderItems, { onDelete: 'CASCADE' })
    order: OrderEntity;

    @Column()
    productUrl: string;

    @Column()
    quantity: number;

    @Column({ type: 'enum', enum: Size, default: Size.S })
    size: Size;

    @Column({ type: 'enum', enum: Color, default: Color.BLACK })
    color: Color;

    @Column({ type: 'enum', enum: OrderCurrency })
    currency: OrderCurrency;

    @Column({ type: 'enum', enum: OrderCountry })
    country: OrderCountry;

    @Column({ type: 'float'})
    productPrice: number;

    @Column({ type: 'float'})
    totalPrice: number;

    @Column({ type: 'float'})
    localPrice: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
