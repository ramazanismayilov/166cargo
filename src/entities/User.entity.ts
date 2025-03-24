import {
    Column,
    Entity,
    OneToOne,
    UpdateDateColumn,
    CreateDateColumn,
    PrimaryGeneratedColumn,
} from "typeorm";
import { ProfileEntity } from "./Profile.entity";
import { UserRole, UserType } from "src/common/enums/user.enum";
import { PhonePrefix } from "src/common/enums/phone.enum";
import { IdSerialPrefix } from "src/common/enums/idSerialNumber.enum";

@Entity('user')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    email: string

    @Column()
    password: string

    @Column({ type: 'enum', enum: PhonePrefix, default: PhonePrefix.P010 })
    phonePrefix: PhonePrefix;

    @Column({ unique: true })
    phone: string

    @Column({ type: 'enum', enum: IdSerialPrefix, default: IdSerialPrefix.AA })
    idSerialPrefix: IdSerialPrefix

    @Column({ unique: true })
    idSerialNumber: string

    @Column({ unique: true })
    idFinCode: string

    @Column()
    customerNumber: number

    @Column({ default: false })
    logout: boolean

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    loginDate: Date

    @Column({ type: 'enum', enum: UserType, default: UserType.INDIVIDUAL })
    userType: UserType;

    @Column({ nullable: true })
    voen: string;

    @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
    role: UserRole;

    @OneToOne(() => ProfileEntity, (profile) => profile.user, { cascade: true })
    profile: ProfileEntity;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}