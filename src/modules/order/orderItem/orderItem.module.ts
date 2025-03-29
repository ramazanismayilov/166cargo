import { Module } from "@nestjs/common";
import { OrderItemController } from "./orderItem.controller";
import { OrderItemService } from "./orderItem.service";

@Module({
    imports: [],
    controllers: [OrderItemController],
    providers: [OrderItemService]
})
export class OrderItemModule { }