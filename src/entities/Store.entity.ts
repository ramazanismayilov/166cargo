import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ImageEntity } from "./Image.entity";
import { CategoryStoreEntity } from "./CategoryStore.entity";

@Entity('store')
export class StoreEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    storeUrl: string;

    @OneToOne(() => ImageEntity, { onDelete: 'SET NULL' })
    @JoinColumn({
        name: 'imageId',
        referencedColumnName: 'id',
    })
    image: ImageEntity;

    @OneToMany(() => CategoryStoreEntity, (categoryStore) => categoryStore.store)
    categoryStores: CategoryStoreEntity[];
}
