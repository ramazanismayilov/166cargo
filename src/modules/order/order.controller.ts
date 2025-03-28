import { Body, Controller, Get, Post } from "@nestjs/common";
import { OrderService } from "./order.service";
import { Auth } from "src/common/decorators/auth.decorator";
import { AddOrderItemDto } from "./dto/addOrderItem.dto";
import { UserRole } from "src/common/enums/user.enum";

@Controller()
export class OrderController {
    constructor(private orderService: OrderService) { }

    @Get("orderItems")
    allOrderItems() {
        return this.orderService.allOrderItems()
    }

    @Post("orderItem")
    @Auth(UserRole.ADMIN, UserRole.USER)
    addNews(@Body() body: AddOrderItemDto) {
        return this.orderService.addOrderItem(body)
    }
}