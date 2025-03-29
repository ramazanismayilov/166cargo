import { PartialType } from "@nestjs/swagger";
import { AddOrderItemDto } from "./addOrderItem.dto";

export class UpdateOrderItem extends PartialType(AddOrderItemDto){}