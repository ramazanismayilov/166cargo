import { PartialType } from "@nestjs/swagger";
import { AddGeneralDto } from "./addGeneral.dto";

export class UpdateGeneralDto extends PartialType(AddGeneralDto) { }
