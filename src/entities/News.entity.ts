import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ImageEntity } from './Image.entity';

@Entity('news')
export class NewsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => ImageEntity, { onDelete: 'SET NULL' })
    @JoinColumn({
        name: 'imageId',
        referencedColumnName: 'id',
    })
    image: ImageEntity;

    @Column()
    title: string;

    @Column()
    description: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}