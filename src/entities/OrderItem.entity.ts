import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./Order.entity";
import { ProductCategoryEntity } from "./ProductCategory.entity";

@Entity('orderItem')
export class OrderItem {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Order, (order) => order.items)
    order: Order;

    @ManyToOne(() => ProductCategoryEntity, { eager: true })
    productCategory: ProductCategoryEntity;

    @Column()
    quantity: number;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;
}
