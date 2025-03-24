import { TariffCountry } from "src/common/enums/tariffCountry.enum";

export class TariffCalculator {
    calculate(tariffDto: any): number {
        const { width, height, length, country, priceUSD, pricePoundSterling } = tariffDto;
        let resultTariff = 0;
        let priceLocal = 0; // priceLocal inicializasiya edilir
    
        if (width >= 60 && height >= 60 && length >= 60) {
            const volumetricWeight = (width * height * length) / 6000;
            let countryTariff = 1;
    
            switch (country) {
                case TariffCountry.TURKEY:
                    countryTariff = 0.66;
                    resultTariff = volumetricWeight * countryTariff;
                    // Turkey üçün priceLocal hesablanır
                    priceLocal = priceUSD * 1.70;
                    return resultTariff + priceLocal;
                case TariffCountry.USA:
                    countryTariff = 2.66;
                    resultTariff = volumetricWeight * countryTariff;
                    // USA üçün priceLocal hesablanır
                    priceLocal = priceUSD * 1.70;
                    return resultTariff + priceLocal;
                case TariffCountry.ENGLAND:
                    countryTariff = 2.90;
                    resultTariff = volumetricWeight * countryTariff;
                    // England üçün GBP hesablanır və priceLocal, 1 GBP = 2.50 AZN ilə çevrilir
                    priceLocal = pricePoundSterling * 2.50;
                    return resultTariff + priceLocal;
                default:
                    countryTariff = 1;
                    resultTariff = volumetricWeight * countryTariff;
                    return resultTariff + priceUSD;
            }
        }
        return priceUSD;
    }
    


}