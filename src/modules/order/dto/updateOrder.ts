import { PartialType } from "@nestjs/swagger";
import { OrderBaseDto } from "./orderBase.dto";

export class UpdateOrder extends PartialType(OrderBaseDto) { }