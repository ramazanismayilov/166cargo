import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { OrderService } from "./order.service";
import { Auth } from "src/common/decorators/auth.decorator";
import { AddOrderDto } from "./dto/addOrder.dto";
import { UserRole } from "src/common/enums/user.enum";

@Controller('orders')
export class OrderController {
    constructor(private orderService: OrderService) { }

    @Get()
    allOrders() {
        return this.orderService.allOrders()
    }

    @Post()
    @Auth(UserRole.USER, UserRole.ADMIN)
    addOrder(@Body() body: AddOrderDto) {
        return this.orderService.addOrder(body)
    }

    @Delete(':id')
    @Auth(UserRole.USER, UserRole.ADMIN)
    deleteOrder(@Param('id') id: number) {
        return this.orderService.deleteOrder(id)
    }
}