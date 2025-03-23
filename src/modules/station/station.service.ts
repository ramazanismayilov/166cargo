import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { StationEntity } from "src/entities/Station.entity";
import { DataSource, Repository } from "typeorm";
import { AddStationDto } from "./dto/addStation.dto";
import { UpdateStationDto } from "./dto/updateStation.dto";

@Injectable()
export class StationService {
    private stationRepo: Repository<StationEntity>
    constructor(
        @InjectDataSource() private dataSource: DataSource
    ) {
        this.stationRepo = this.dataSource.getRepository(StationEntity)
    }

    async allStations() {
        const stations = await this.stationRepo.find({ order: { id: 'ASC' } })
        if (stations.length === 0) throw new NotFoundException('Stations not found');

        return stations
    }

    async addStation(params: AddStationDto) {
        let stationExists = await this.stationRepo.findOne({ where: { name: params.name } })
        if (stationExists) throw new ConflictException({ message: 'Station already exists' });

        const station = this.stationRepo.create(params);
        await this.stationRepo.save(station);

        return { message: "Station created succesfully", station };
    }

    async updateStation(id: number, params: UpdateStationDto) {
        let station = await this.stationRepo.findOne({ where: { id } });
        if (!station) throw new NotFoundException({ message: 'Station not found' });

        station.name = params.name;
        await this.stationRepo.save(station);
        return { message: "Station updated successfully", station };
    }

    async deleteStation(id: number) {
        let station = await this.stationRepo.findOne({ where: { id } });
        if (!station) throw new NotFoundException({ message: 'Station not found' });

        await this.stationRepo.delete(id);
        return { message: "Station deleted successfully" };
    }
}