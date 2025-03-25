import { Body, Controller, Get, Post } from "@nestjs/common";
import { TariffService } from "./tariff.service";
import { Auth } from "src/common/decorators/auth.decorator";
import { UserRole } from "src/common/enums/user.enum";
import { AddTariffDto } from "./dto/addTariff.dto";

@Controller('tariff')
export class TariffController {
    constructor(private tariffService: TariffService) { }

    @Get()
    allTariffs() {
        return this.tariffService.allTaariffs()
    }

    @Post()
    @Auth(UserRole.ADMIN)
    addTariff(@Body() body: AddTariffDto) {
        return this.tariffService.addTariff(body)
    }
}
