import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { TariffEntity } from "src/entities/Tariff.entity";
import { DataSource, Repository } from "typeorm";
import { AddTariffDto } from "./dto/addTariff.dto";
import { TariffCountry } from "src/common/enums/tariffCountry.enum";

@Injectable()
export class TariffService {
    private tariffRepo: Repository<TariffEntity>
    constructor(
        @InjectDataSource() private dataSource: DataSource
    ) {
        this.tariffRepo = this.dataSource.getRepository(TariffEntity)
    }

    async allTaariffs() {
        const taariffs = await this.tariffRepo.find({ order: { id: 'ASC' } })
        if (taariffs.length === 0) throw new NotFoundException('Taariffs not found');

        return taariffs
    }

    async addTariff(params: AddTariffDto) {
        const { width, height, length, country, weightRangeStart, weightRangeEnd, priceUSD, priceGBP } = params;
        let weightStart = weightRangeStart;
        let weightEnd = weightRangeEnd;
        let volumetricWeight = 0;
        let countryTariff = 0;
        let calculatedPriceUSD = priceUSD;
        let calculatedPriceGBP = priceGBP;
        let calculatedPriceLocal = 0;
        const exchangeRateUSD = 1.70;
        const exchangeRateGBP = 2.50;

        if (width >= 60 || height >= 60 || length >= 60) {
            volumetricWeight = (width * height * length) / 6000;

            switch (country) {
                case TariffCountry.TURKEY:
                    countryTariff = 0.66;
                    calculatedPriceUSD = volumetricWeight * countryTariff;
                    calculatedPriceGBP = 0;
                    calculatedPriceLocal = calculatedPriceUSD * exchangeRateUSD;
                    break;
                case TariffCountry.ENGLAND:
                    countryTariff = 2.90;
                    calculatedPriceGBP = volumetricWeight * countryTariff;
                    calculatedPriceUSD = 0;
                    calculatedPriceLocal = calculatedPriceGBP * exchangeRateGBP;
                    break;
                case TariffCountry.USA:
                    countryTariff = 2.66;
                    calculatedPriceUSD = volumetricWeight * countryTariff;
                    calculatedPriceGBP = 0;
                    calculatedPriceLocal = calculatedPriceUSD * exchangeRateUSD;
                    break;
            }

            weightStart = volumetricWeight;
            weightEnd = volumetricWeight + 0.250;
        } else {
            switch (country) {
                case TariffCountry.TURKEY:
                    calculatedPriceLocal = priceUSD * exchangeRateUSD;
                    break;
                case TariffCountry.ENGLAND:
                    calculatedPriceLocal = priceGBP * exchangeRateGBP;
                    break;
                case TariffCountry.USA:
                    calculatedPriceLocal = priceUSD * exchangeRateUSD;
                    break;
            }
        }

        const tariff = this.tariffRepo.create({
            weightRangeStart: weightStart,
            weightRangeEnd: weightEnd,
            priceUSD: calculatedPriceUSD,
            priceGBP: calculatedPriceGBP,
            priceLocal: calculatedPriceLocal,
            width,
            height,
            length,
            country
        });

        await this.tariffRepo.save(tariff);

        return {
            message: 'Tariff created successfully',
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