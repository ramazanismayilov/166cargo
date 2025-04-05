import { TariffCountry } from "../enums/tariffCountry.enum";

export function calculateTariff({
    weight,
    width,
    height,
    length,
    country,
    exchangeRateUSD = 1.70,
    exchangeRateGBP = 2.50,
}: {
    weight: number;
    width: number;
    height: number;
    length: number;
    country: TariffCountry;
    exchangeRateUSD?: number;
    exchangeRateGBP?: number;
}) {
    let volumetricWeight = 0;
    let calculatedPriceUSD = 0;
    let calculatedPriceGBP = 0;
    let calculatedPriceLocal = 0;
    let countryTariff = 0;

    const isVolumetric = width >= 60 || height >= 60 || length >= 60;

    if (isVolumetric) {
        volumetricWeight = (width * height * length) / 6000;
        switch (country) {
            case TariffCountry.TURKEY:
                countryTariff = 3.80;
                calculatedPriceUSD = volumetricWeight * countryTariff;
                calculatedPriceLocal = calculatedPriceUSD * exchangeRateUSD;
                break;
            case TariffCountry.ENGLAND:
                countryTariff = 7.90;
                calculatedPriceGBP = volumetricWeight * countryTariff;
                calculatedPriceLocal = calculatedPriceGBP * exchangeRateGBP;
                break;
            case TariffCountry.USA:
                countryTariff = 7.99;
                calculatedPriceUSD = volumetricWeight * countryTariff;
                calculatedPriceLocal = calculatedPriceUSD * exchangeRateUSD;
                break;
        }
    } else {
        switch (country) {
            case TariffCountry.TURKEY:
                if (weight <= 0.050) calculatedPriceUSD = 0.66;
                else if (weight <= 0.250) calculatedPriceUSD = 1.66;
                else if (weight <= 0.500) calculatedPriceUSD = 3.00;
                else if (weight <= 0.700) calculatedPriceUSD = 3.50;
                else if (weight <= 1.000) calculatedPriceUSD = 3.80;
                calculatedPriceLocal = calculatedPriceUSD * exchangeRateUSD;
                break;
            case TariffCountry.ENGLAND:
                if (weight <= 0.150) calculatedPriceGBP = 0.66;
                else if (weight <= 0.250) calculatedPriceGBP = 4.40;
                else if (weight <= 0.500) calculatedPriceGBP = 6.40;
                else if (weight <= 0.700) calculatedPriceGBP = 7.35;
                else if (weight <= 1.000) calculatedPriceGBP = 7.99;
                calculatedPriceLocal = calculatedPriceGBP * exchangeRateGBP;
                break;
            case TariffCountry.USA:
                if (weight <= 0.100) calculatedPriceUSD = 2.66;
                else if (weight <= 0.250) calculatedPriceUSD = 4.40;
                else if (weight <= 0.500) calculatedPriceUSD = 6.40;
                else if (weight <= 0.700) calculatedPriceUSD = 7.35;
                else if (weight <= 1.000) calculatedPriceUSD = 7.99;
                calculatedPriceLocal = calculatedPriceUSD * exchangeRateUSD;
                break;
        }
    }

    return {
        priceUSD: calculatedPriceUSD,
        priceGBP: calculatedPriceGBP,
        priceLocal: calculatedPriceLocal,
    };
}
