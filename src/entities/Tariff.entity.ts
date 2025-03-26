import { TariffCountry } from 'src/common/enums/tariffCountry.enum';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tariff')
export class TariffEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'enum', enum: TariffCountry, default: TariffCountry.TURKEY })
    country: TariffCountry

    @Column('float')
    weightRangeStart: number;

    @Column('float')
    weightRangeEnd: number;

    @Column('float')
    priceUSD: number;

    @Column('float')
    priceGBP: number;

    @Column('float')
    priceLocal: number;

    @Column('float')
    width: number;

    @Column('float')
    height: number;

    @Column('float')
    length: number;
}
