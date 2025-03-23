import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { AddStationDto } from "./dto/addStation.dto";
import { StationService } from "./station.service";
import { UpdateStationDto } from "./dto/updateStation.dto";
import { Auth } from "src/common/decorators/auth.decorator";

@Controller('stations')
export class StationController {
    constructor(private stationService: StationService) { }

    @Get()
    allStations() {
        return this.stationService.allStations()
    }

    @Post()
    @Auth()
    addStation(@Body() body: AddStationDto) {
        return this.stationService.addStation(body)
    }

    @Post(':id')
    @Auth()
    updateStation(@Param('id') id: number, @Body() body: UpdateStationDto) {
        return this.stationService.updateStation(id, body)
    }

    @Delete(':id')
    @Auth()
    deleteStation(@Param('id') id: number) {
        return this.stationService.deleteStation(id)
    }
}