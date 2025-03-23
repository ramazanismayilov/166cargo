import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { Auth } from "src/common/decorators/auth.decorator";
import { CreateForgetPasswordDto } from "./dto/create-forget-password.dto";
import { ConfirmForgetPaswordDto } from "./dto/confirm-forget-password.dto";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    login(@Body() body: LoginDto) {
        return this.authService.login(body)
    }

    @Post('register')
    register(@Body() body: RegisterDto) {
        return this.authService.register(body)
    }

    @Post('logout')
    @Auth()
    logOut() {
        return this.authService.logOut()
    }

    @Post('reset-password')
    @Auth()
    resetPassword(@Body() body: ResetPasswordDto) {
        return this.authService.resetPassword(body)
    }

    @Post('forget-password')
    createForgetPasswordRequest(@Body() body: CreateForgetPasswordDto) {
        return this.authService.createForgetPasswordRequest(body)
    }

    @Post('forget-password/confirm')
    confirmPassword(@Body() body: ConfirmForgetPaswordDto) {
        return this.authService.confirmForgetPassword(body);
    }
}