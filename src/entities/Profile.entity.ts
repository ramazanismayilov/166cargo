import {
    Column,
    Entity,
    OneToOne,
    JoinColumn,
    BaseEntity,
    UpdateDateColumn,
    CreateDateColumn,
    PrimaryGeneratedColumn,
    ManyToOne,
} from "typeorm";
import { UserEntity } from "./User.entity";
import { Gender } from "src/common/enums/gender.enum";
import { Nationality } from "src/common/enums/nationality.enum";
import { StationEntity } from "./Station.entity";

@Entity('profile')
export class ProfileEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column({ type: 'enum', enum: Gender, default: Gender.MALE })
    gender: Gender

    @Column()
    birthDate: Date

    @Column({ type: 'enum', enum: Nationality, default: Nationality.AZERBAIJAN })
    nationality: Nationality.AZERBAIJAN

    @Column()
    address: string

    @ManyToOne(() => StationEntity, { onDelete: 'SET NULL' })
    station: StationEntity;

    @Column({ nullable: true })
    coupon: string

    @Column({ type: 'timestamp', nullable: true })
    promoDate: Date

    @Column({ type: 'decimal', default: 0 })
    balance: number

    @Column({ type: 'int', default: 0 })
    bundleCount: number

    @OneToOne(() => UserEntity, (user) => user.profile, { onDelete: 'CASCADE' })
    @JoinColumn({
        name: 'userId',
        referencedColumnName: 'id'
    })
    user: UserEntity;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}