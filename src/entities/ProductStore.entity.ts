import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ProductCategoryEntity } from "./ProductCategory.entity";
import { StoreEntity } from "./Store.entity";

@Entity('productStore')
export class ProductStoreEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ProductCategoryEntity, (productCategory) => productCategory.stores, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'productCategoryId' })
    productCategory: ProductCategoryEntity;

    @ManyToOne(() => StoreEntity, (store) => store.products, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'storeId' })
    store: StoreEntity;
}
