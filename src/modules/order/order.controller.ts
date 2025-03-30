import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { OrderService } from "./order.service";
import { Auth } from "src/common/decorators/auth.decorator";
import { AddOrderDto } from "./dto/addOrder.dto";
import { UserRole } from "src/common/enums/user.enum";
import { OrderStatusDto } from "./dto/orderStatus.dto";
import { IsDeclaredDto } from "./dto/isDeclared.dto";

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
    @Auth(UserRole.ADMIN)
    deleteOrder(@Param('id') id: number) {
        return this.orderService.deleteOrder(id)
    }

    @Post('status/:trackingNumber')
    @Auth(UserRole.USER, UserRole.ADMIN)
    statusChange(@Param('trackingNumber') trackingNumber: number, @Body() body: OrderStatusDto) {
        return this.orderService.statusChange(trackingNumber, body)
    }

    @Post('isDeclared/:trackingNumber')
    @Auth(UserRole.USER, UserRole.ADMIN)
    isDeclared(@Param('trackingNumber') trackingNumber: number, @Body() body: IsDeclaredDto) {
        return this.orderService.isDeclared(trackingNumber, body)
    }
}