import { Module } from "@nestjs/common";
import { OrderController } from "./order.controller";
import { OrderService } from "./order.service";
import { OrderItemModule } from "./orderItem/orderItem.module";

@Module({
    imports: [OrderItemModule],
    controllers: [OrderController],
    providers: [OrderService]
})
export class OrderModule { }