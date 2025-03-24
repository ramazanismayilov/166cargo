import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { Auth } from "src/common/decorators/auth.decorator";
import { UserRole } from "src/common/enums/user.enum";
import { ProfileUpdateDto } from "./dto/updateProfile.dto";

@Controller('users')
export class UserController {
    constructor(private userService: UserService) { }

    @Get()
    @Auth(UserRole.ADMIN)
    getUses() {
        return this.userService.getUsers()
    }

    @Get(':id')
    @Auth(UserRole.ADMIN)
    getUser(@Param('id') id: number) {
        return this.userService.getUser(id)
    }

    @Delete(':id')
    @Auth(UserRole.ADMIN, UserRole.USER)
    async deleteUser(@Param('id') id: number) {
        return this.userService.deleteUser(id);
    }

    @Post('profile')
    @Auth()
    async updateProfile(@Body() body: ProfileUpdateDto) {
        return this.userService.updateProfile(body);
    }
}