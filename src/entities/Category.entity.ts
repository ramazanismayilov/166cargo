import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CategoryStoreEntity } from "./CategoryStore.entity";
import { ImageEntity } from "./Image.entity";

@Entity('category')
export class CategoryEntity {
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

    @OneToMany(() => CategoryStoreEntity, (categoryStore) => categoryStore.category)
    categoryStores: CategoryStoreEntity[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
