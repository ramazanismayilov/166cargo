import { Module } from "@nestjs/common";
import { StoreController } from "./store.controller";
import { StoreService } from "./store.service";

@Module({
    imports: [],
    controllers: [StoreController],
    providers: [StoreService]
})
export class StoreModule { }