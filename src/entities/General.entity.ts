import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ImageEntity } from './Image.entity';

@Entity('general')
export class GeneralEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => ImageEntity, { onDelete: 'SET NULL' })
    @JoinColumn({
        name: 'logoId',
        referencedColumnName: 'id',
    })
    logo: ImageEntity | null;

    @Column()
    sitename: string;

    @Column()
    phone: string;

    @Column()
    location: string;

    @Column()
    email: string;

    @Column()
    workTime: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
