import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserUtils } from "src/common/utils/user.utils";

@Module({
    imports: [],
    controllers: [AuthController],
    providers: [AuthService, UserUtils]
})
export class AuthModule { }