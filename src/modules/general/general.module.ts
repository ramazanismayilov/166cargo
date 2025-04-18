import { Module } from "@nestjs/common";
import { GeneralController } from "./general.controller";
import { GeneralService } from "./general.service";

@Module({
    imports: [],
    controllers: [GeneralController],
    providers: [GeneralService]
})
export class GeneralModule { }