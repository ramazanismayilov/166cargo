import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { AddStationDto } from "./dto/addStation.dto";
import { StationService } from "./station.service";
import { UpdateStationDto } from "./dto/updateStation.dto";
import { Auth } from "src/common/decorators/auth.decorator";
import { UserRole } from "src/common/enums/user.enum";

@Controller('station')
export class StationController {
    constructor(private stationService: StationService) { }

    @Get()
    allStations() {
        return this.stationService.allStations()
    }

    @Post()
    @Auth(UserRole.ADMIN)
    addStation(@Body() body: AddStationDto) {
        return this.stationService.addStation(body)
    }

    @Post(':id')
    @Auth(UserRole.ADMIN)
    updateStation(@Param('id') id: number, @Body() body: UpdateStationDto) {
        return this.stationService.updateStation(id, body)
    }

    @Delete(':id')
    @Auth(UserRole.ADMIN)
    deleteStation(@Param('id') id: number) {
        return this.stationService.deleteStation(id)
    }
}