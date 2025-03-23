import { SetMetadata } from "@nestjs/common";
import { UserRole } from "../enums/user.enum";

export const Role = (...roles: UserRole[]) => {
    return SetMetadata("roles", roles)
}