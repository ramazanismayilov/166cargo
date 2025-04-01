import {
    Column,
    Entity,
    OneToOne,
    JoinColumn,
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
export class ProfileEntity {
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
    nationality: Nationality

    @Column()
    address: string

    @ManyToOne(() => StationEntity, { onDelete: 'SET NULL', nullable: true })
    station: StationEntity;

    @Column({ type: 'int', nullable: true })
    promoCode: number | null; 

    @Column({ type: 'float', default: 0 })
    balance: number

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