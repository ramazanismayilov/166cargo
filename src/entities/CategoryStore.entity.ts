import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CategoryEntity } from "./Category.entity";
import { StoreEntity } from "./Store.entity";

@Entity('categoryStore')
export class CategoryStoreEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => CategoryEntity, (productCategory) => productCategory.categoryStores, { onDelete: 'CASCADE' })
    category: CategoryEntity;

    @ManyToOne(() => StoreEntity, (store) => store.categoryStores, { onDelete: 'CASCADE' })
    store: StoreEntity;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
