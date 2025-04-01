import { NewsBaseDto } from "./newsBase.dto";
import { PartialType } from "@nestjs/swagger";

export class UpdateNewsDto extends PartialType(NewsBaseDto) {}
