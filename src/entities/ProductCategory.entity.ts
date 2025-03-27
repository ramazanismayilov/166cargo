import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ProductStoreEntity } from "./ProductStore.entity";
import { ImageEntity } from "./Image.entity";

@Entity('productCategory')
export class ProductCategoryEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToOne(() => ImageEntity, { onDelete: 'SET NULL' })
    @JoinColumn({
        name: 'imageId',
        referencedColumnName: 'id',
    })
    image: ImageEntity | null;

    @OneToMany(() => ProductStoreEntity, (productStore) => productStore.productCategory)
    stores: ProductStoreEntity[];
}
