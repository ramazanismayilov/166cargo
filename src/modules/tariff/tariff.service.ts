import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { TariffEntity } from "src/entities/Tariff.entity";
import { DataSource, Repository } from "typeorm";
import { AddTariffDto } from "./dto/addTariff.dto";
import { TariffCountry } from "src/common/enums/tariffCountry.enum";
import { roundToDecimal } from "src/common/utils/number.utils";
import { calculateTariff } from "src/common/utils/tariff.utils";

@Injectable()
export class TariffService {
    private tariffRepo: Repository<TariffEntity>
    constructor(
        @InjectDataSource() private dataSource: DataSource
    ) {
        this.tariffRepo = this.dataSource.getRepository(TariffEntity)
    }

    async allTariffs() {
        const tariffs = await this.tariffRepo.find({ order: { id: 'ASC' } })
        if (tariffs.length === 0) throw new NotFoundException('Tariffs not found');

        return tariffs
    }

    async addTariff(params: AddTariffDto) {
        const { weight, width, height, length, country } = params;
        const { priceUSD, priceGBP, priceLocal } = calculateTariff({
            weight,
            width,
            height,
            length,
            country
        });

        const tariff = this.tariffRepo.create({
            weightRangeStart: weight,
            weightRangeEnd: weight,
            priceUSD: roundToDecimal(priceUSD),
            priceGBP: roundToDecimal(priceGBP),
            priceLocal: roundToDecimal(priceLocal),
            width,
            height,
            length,
            country
        });

        await this.tariffRepo.save(tariff);

        return {
            message: 'Tarif uğurla yaradıldı',
            tariff,
        };
    }

    async deleteTariff(tariffId: number) {
        let tariff = await this.tariffRepo.findOne({ where: { id: tariffId } });
        if (!tariff) throw new NotFoundException({ message: 'Tariff not found' });

        await this.tariffRepo.delete(tariffId);
        return { message: "Tariff deleted successfully" };
    }
}