import { PartialType } from "@nestjs/swagger";
import { AddOrderDto } from "./addOrder.dto";

export class UpdateOrder extends PartialType(AddOrderDto) { }