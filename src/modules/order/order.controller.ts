import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { OrderService } from "./order.service";
import { Auth } from "src/common/decorators/auth.decorator";
import { AddOrderDto } from "./dto/addOrder.dto";

@Controller('orders')
export class OrderController {
    constructor(private orderService: OrderService) { }

    @Get()
    allOrders() {
        return this.orderService.allOrders()
    }

    @Post()
    @Auth()
    addOrder(@Body() body: AddOrderDto) {
        return this.orderService.addOrder(body)
    }

    @Delete(':id')
    @Auth()
    deleteOrder(@Param('id') id: number) {
        return this.orderService.deleteOrder(id)
    }
}