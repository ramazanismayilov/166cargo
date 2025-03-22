import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { AddStationDto } from "./dto/addStation.dto";
import { StationService } from "./station.service";
import { UpdateStationDto } from "./dto/updateStation.dto";

@Controller('stations')
export class StationController {
    constructor(private stationService: StationService) { }

    @Get()
    allStations() {
        return this.stationService.allStations()
    }

    @Post()
    addStation(@Body() body: AddStationDto) {
        return this.stationService.addStation(body)
    }

    @Post(':id')
    updateStation(@Param('id') id: number, @Body() body: UpdateStationDto) {
        return this.stationService.updateStation(id, body)
    }

    @Delete(':id')
    deleteStation(@Param('id') id: number) {
        return this.stationService.deleteStation(id)
    }
}