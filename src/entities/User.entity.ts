import {
    Column,
    Entity,
    OneToOne,
    BaseEntity,
    BeforeInsert,
    BeforeUpdate,
    UpdateDateColumn,
    CreateDateColumn,
    PrimaryGeneratedColumn,
} from "typeorm";
import * as bcrypt from 'bcrypt';
import { ProfileEntity } from "./Profile.entity";
import { UserType } from "src/common/enums/user.enum";
import { PhonePrefix } from "src/common/enums/phone.enum";

@Entity('user')
export class UserEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    email: string

    @Column()
    password: string

    @Column({ type: 'enum', enum: PhonePrefix, default: PhonePrefix.P010 })
    phonePrefix: PhonePrefix;

    @Column()
    phone: string

    @Column({ unique: true })
    idSerialNumber: string

    @Column({ unique: true })
    idFinCode: string

    @Column('uuid')
    customerNumber: string

    @Column({ default: false })
    logout: boolean

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    loginDate: Date

    @Column({ type: 'enum', enum: UserType, default: UserType.INDIVIDUAL })
    userType: UserType;

    @Column({ nullable: true })
    voen: string;

    @OneToOne(() => ProfileEntity, (profile) => profile.user, { cascade: true })
    profile: ProfileEntity;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @BeforeInsert()
    @BeforeUpdate()
    async beforeUpsert() {
        if (this.password) {
            this.password = await bcrypt.hash(this.password, 10)
        }
    }
}