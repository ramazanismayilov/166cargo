import { Global, Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserUtils } from "src/common/utils/user.utils";

@Global()
@Module({
    imports: [],
    controllers: [UserController],
    providers: [UserService, UserUtils],
    exports: [UserService]
})
export class UserModule { }