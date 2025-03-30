import { PartialType } from "@nestjs/swagger";
import { OrderItemBaseDto } from "./orderItemBase.dto";

export class UpdateOrderItem extends PartialType(OrderItemBaseDto) { }