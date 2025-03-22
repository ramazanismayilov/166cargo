import {
    Column,
    Entity,
    UpdateDateColumn,
    CreateDateColumn,
    PrimaryGeneratedColumn,
    OneToMany,
} from "typeorm";
import { ProfileEntity } from "./Profile.entity";

@Entity('station')
export class StationEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @OneToMany(() => ProfileEntity, (profile) => profile.station)
    profiles: ProfileEntity[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}