import { Module } from "@nestjs/common";
import { TariffController } from "./tariff.controller";
import { TariffService } from "./tariff.service";

@Module({
    imports: [],
    controllers: [TariffController],
    providers: [TariffService]
})
export class TariffModule { }