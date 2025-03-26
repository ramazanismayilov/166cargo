import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { GeneralService } from "./general.service";
import { Auth } from "src/common/decorators/auth.decorator";
import { AddGeneralDto } from "./dto/addGeneral.dto";
import { UserRole } from "src/common/enums/user.enum";
import { UpdateGeneralDto } from "./dto/updateGeneral.dto";

@Controller('general')
export class GeneralController {
    constructor(private generalService: GeneralService) { }

    @Get()
    allGenerals() {
        return this.generalService.allGenerals()
    }

    @Post()
    @Auth(UserRole.ADMIN)
    addNews(@Body() body: AddGeneralDto) {
        return this.generalService.addGeneral(body)
    }

    @Post(':id')
    @Auth(UserRole.ADMIN)
    updateNews(@Param('id') id: number, @Body() body: UpdateGeneralDto) {
        return this.generalService.updateGeneral(id, body)
    }

    @Delete(':id')
    @Auth(UserRole.ADMIN)
    deleteNews(@Param('id') id: number) {
        return this.generalService.deleteGeneral(id)
    }
}