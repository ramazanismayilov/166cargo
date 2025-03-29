import { BadRequestException } from "@nestjs/common"
import { OrderCountry, OrderCurrency } from "../enums/order.enum"

export function validateOrderCountry(country?: string, currency?: string) {
    if (!country || !currency) {
        throw new BadRequestException("Country and currency must be provided.");
    }

    if (country === OrderCountry.TURKEY && currency === OrderCurrency.USD) {
        throw new BadRequestException("For Turkey, only TRY currency is accepted.");
    }

    if (country === OrderCountry.USA && currency === OrderCurrency.TRY) {
        throw new BadRequestException("For the USA, only USD currency is accepted.");
    }
}
