import { Module } from "@nestjs/common";
import { StationService } from "./station.service";
import { StationController } from "./station.controller";

@Module({
    imports: [],
    controllers: [StationController],
    providers: [StationService]
})
export class StationModule { }