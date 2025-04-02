import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { Auth } from "src/common/decorators/auth.decorator";
import { UserRole } from "src/common/enums/user.enum";
import { ProfileUpdateDto } from "./dto/updateProfile.dto";
import { IncreaseBalanceDto } from "./dto/increaseBalance.dto";

@Controller('users')
export class UserController {
    constructor(private userService: UserService) { }

    @Get()
    @Auth(UserRole.ADMIN)
    getUsers() {
        return this.userService.getUsers()
    }

    @Get(':id')
    @Auth(UserRole.ADMIN)
    getUser(@Param('id') id: number) {
        return this.userService.getUser(id)
    }

    @Delete(':id')
    @Auth()
    async deleteUser(@Param('id') id: number) {
        return this.userService.deleteUser(id);
    }

    @Post('profile')
    @Auth(UserRole.ADMIN, UserRole.USER)
    async updateProfile(@Body() body: ProfileUpdateDto) {
        return this.userService.updateProfile(body);
    }

    @Post('increaseBalance')
    @Auth()
    async increaseBalance(@Body() body: IncreaseBalanceDto) {
        return this.userService.increaseBalance(body);
    }
}