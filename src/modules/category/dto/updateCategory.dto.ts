import { PartialType } from "@nestjs/swagger";
import { AddCategoryDto } from "./addCategory.dto";

export class UpdateCategoryDto extends PartialType(AddCategoryDto) { }
