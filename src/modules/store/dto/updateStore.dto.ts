import { PartialType } from "@nestjs/swagger";
import { AddStoreDto } from "./addStore.dto";

export class UpdateStoreDto extends PartialType(AddStoreDto) { }
