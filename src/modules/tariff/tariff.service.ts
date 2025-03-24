import { Injectable } from "@nestjs/common";
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

    async allTariffs() { }

    async addTariff(params: AddTariffDto) {
        const { width, height, length, country } = params;
        const volumetricWeight = (width * height * length) / 6000;

        let countryTariff: number;
        let calculatedPriceUSD: number = 0;
        let calculatedPricePoundSterling: number = 0;
        let calculatedPriceLocal = 0;

        switch (country) {
            case TariffCountry.TURKEY:
                countryTariff = 0.66;
                calculatedPriceUSD = volumetricWeight * countryTariff;
                calculatedPriceLocal = calculatedPriceUSD * 1.70
                break;
            case TariffCountry.ENGLAND:
                countryTariff = 2.90;
                calculatedPricePoundSterling = volumetricWeight * countryTariff;
                calculatedPriceLocal = calculatedPricePoundSterling * 2.50
                break;
            case TariffCountry.USA:
                countryTariff = 2.66;
                calculatedPriceUSD = volumetricWeight * countryTariff;
                calculatedPriceLocal = calculatedPriceUSD * 1.70
                break;
        }

        // Çəki aralığının hesablanması (aralıq nömrəsi olaraq istifadə edilə bilər)
        const weightRangeStart = volumetricWeight;
        const weightRangeEnd = weightRangeStart + 1;  // Nümunə olaraq bir vahid artırırıq

        // Tariff məlumatlarının yaradılması və DB-ə əlavə edilməsi
        const tariff = this.tariffRepo.create({
            weightRangeStart,
            weightRangeEnd,
            priceUSD: calculatedPriceUSD,
            priceGBP: calculatedPricePoundSterling,
            priceLocal: calculatedPriceLocal,  // Yerli qiymət lazım olsa əlavə edilə bilər
        });

        // Tariff məlumatını bazaya əlavə edirik
        await this.tariffRepo.save(tariff);

        // Uğurlu nəticəni qaytarırıq
        return {
            message: 'Tariff created successfully',
            tariff,
        };
    }

    async updateTariff(params: UpdateTariffDto) { }
    async deleteTariff(tariffId: number) { }
}