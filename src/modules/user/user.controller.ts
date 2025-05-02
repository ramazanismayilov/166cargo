import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { Auth } from "src/common/decorators/auth.decorator";
import { UserRole } from "src/common/enums/user.enum";
import { ProfileUpdateDto } from "./dto/updateProfile.dto";
import { IncreaseBalanceDto } from "./dto/increaseBalance.dto";
import { EmailUpdateDto } from "./dto/updateEmail.dto";
import { VerifyNewEmailDto } from "./dto/verifyNewEmail.dto";

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

    @Post('updateEmail')
    @Auth(UserRole.ADMIN, UserRole.USER)
    async updateEmail(@Body() body: EmailUpdateDto) {
        return this.userService.updateEmail(body);
    }

    @Post('verifyNewEmail')
    @Auth(UserRole.ADMIN, UserRole.USER)
    async verifyNewEmail(@Body() body: VerifyNewEmailDto) {
        return this.userService.verifyNewEmail(body);
    }

    @Post('increaseBalance')
    @Auth(UserRole.ADMIN, UserRole.USER)
    async increaseBalance(@Body() body: IncreaseBalanceDto) {
        return this.userService.increaseBalance(body);
    }
}