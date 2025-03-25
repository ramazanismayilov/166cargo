import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { TariffEntity } from "src/entities/Tariff.entity";
import { DataSource, Repository } from "typeorm";
import { AddTariffDto } from "./dto/addTariff.dto";
import { UpdateTariffDto } from "./dto/updateTariff.dto";
import { TariffCountry } from "src/common/enums/tariffCountry.enum";
import { TariffCalculator } from "src/common/utils/tariffCalculator.utils";

@Injectable()
export class TariffService {
    private tariffCalculator = new TariffCalculator();
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
        const { width, height, length, country } = params;
        const volumetricWeight = (width * height * length) / 6000;

        let countryTariff: number;
        let calculatedPriceUSD = 0;
        let calculatedPriceGBP = 0;
        let calculatedPriceLocal = 0;
        let exchangeRateUSD = 1.70;
        let exchangeRateGBP = 2.50;

        if (width >= 60 || height >= 60 || length >= 60) {
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

            const tariff = this.tariffRepo.create({
                weightRangeStart: volumetricWeight,
                weightRangeEnd: volumetricWeight + 0.25,
                priceUSD: calculatedPriceUSD,
                priceGBP: calculatedPriceGBP,
                priceLocal: calculatedPriceLocal,
                width,
                height,
                length
            });

            await this.tariffRepo.save(tariff);

            return {
                message: 'Tariff created successfully',
                tariff,
            };
        } else {
            if (volumetricWeight >= 0 && volumetricWeight <= 0.250) {
                switch (country) {
                    case TariffCountry.TURKEY:
                        calculatedPriceUSD = 0.66;
                        calculatedPriceLocal = 1.12;
                        break;
                    case TariffCountry.ENGLAND:
                        calculatedPriceGBP = 2.90;
                        calculatedPriceLocal = 6.41;
                        break;
                    case TariffCountry.USA:
                        calculatedPriceUSD = 2.66;
                        calculatedPriceLocal = 4.52;
                        break;
                }

                const tariff = this.tariffRepo.create({
                    weightRangeStart: 0,
                    weightRangeEnd: 0.250,
                    priceUSD: calculatedPriceUSD,
                    priceGBP: 0,
                    priceLocal: calculatedPriceLocal,
                    width,
                    height,
                    length
                });

                await this.tariffRepo.save(tariff);

                return {
                    message: 'Tariff created successfully',
                    tariff,
                };
            }
        }
    }



    async updateTariff(params: UpdateTariffDto) { }
    async deleteTariff(tariffId: number) { }
}