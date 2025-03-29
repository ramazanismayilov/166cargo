import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { Auth } from "src/common/decorators/auth.decorator";
import { AddOrderItemDto } from "./dto/addOrderItem.dto";
import { UserRole } from "src/common/enums/user.enum";
import { UpdateOrderItem } from "./dto/updateOrderItem";
import { OrderItemService } from "./orderItem.service";

@Controller('orderItems')
export class OrderItemController {
    constructor(private orderItemService: OrderItemService) { }

    @Get()
    allOrderItems() {
        return this.orderItemService.allOrderItems()
    }

    @Post()
    @Auth()
    addOrderItem(@Body() body: AddOrderItemDto) {
        return this.orderItemService.addOrderItem(body)
    }

    @Post(':id')
    @Auth()
    updateOrderItem(@Param('id') id: number, @Body() body: UpdateOrderItem) {
        return this.orderItemService.updateOrderItem(id, body)
    }

    @Delete(':id')
    @Auth()
    deleteOrderItem(@Param('id') id: number) {
        return this.orderItemService.deleteOrderItem(id)
    }
}