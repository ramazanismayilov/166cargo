import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { UserEntity } from "src/entities/User.entity";
import { DataSource, Repository } from "typeorm";
import { RegisterDto } from "./dto/register.dto";
import { v4 } from "uuid";
import { StationEntity } from "src/entities/Station.entity";
import { LoginDto } from "./dto/login.dto";
import { compare } from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { validateNationality, validatePasswords, validateUserType } from "src/common/utils/register.utils";
import { generateCustomerNumber } from "src/common/utils/customerNumber.utils";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { ClsService } from "nestjs-cls";
import { MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class AuthService {
    private userRepo: Repository<UserEntity>
    private stationRepo: Repository<StationEntity>

    constructor(
        private jwt: JwtService,
        private cls: ClsService,
        private mailer: MailerService,
        @InjectDataSource() private dataSource: DataSource
    ) {
        this.userRepo = this.dataSource.getRepository(UserEntity)
        this.stationRepo = this.dataSource.getRepository(StationEntity)
    }

    async login(params: LoginDto) {
        let user = await this.userRepo.findOne({ where: { email: params.email } });

        if (!user) throw new UnauthorizedException('Username or password is wrong');

        if (user.logout) {
            user.logout = false;
            await this.userRepo.save(user);
        }
        console.log(params.password);
        console.log(user.password);

        let checkPassword = await compare(params.password, user.password);
        console.log(checkPassword);
        if (!checkPassword) throw new UnauthorizedException('Username or password is wrong');

        let token = this.jwt.sign({ userId: user.id });

        return { message: "Login is successfully", token };
    }

    async register(params: RegisterDto) {
        const userExists = await this.userRepo.findOne({ where: { email: params.email } });
        if (userExists) throw new ConflictException('User already exists');

        const station = await this.stationRepo.findOne({ where: { id: params.stationId } });
        if (!station) throw new NotFoundException('Station not found');

        validatePasswords(params.password, params.repeatPassword);
        validateUserType(params.userType, params.voen);
        validateNationality(params.nationality, params.idSerialNumber);

        const user = this.userRepo.create({
            email: params.email,
            password: params.password,
            phone: params.phone,
            idFinCode: params.idFinCode,
            customerNumber: generateCustomerNumber(),
            loginDate: new Date(),
            voen: params.voen,
            profile: {
                firstName: params.firstName,
                lastName: params.lastName,
                gender: params.gender,
                birthDate: params.birthDate,
                address: params.address,
                station,
                coupon: v4(),
                promoDate: new Date(),
            }
        });

        await user.save();
        if (params.email) {
            await this.mailer.sendMail({
                to: params.email,
                subject: 'Welcome to 166 Cargo!',
                template: 'welcome',
                context: {
                    firstName: user.profile.firstName,
                },
            });
        }
        return { message: "Register is successfully", user };
    }

    async logOut() {
        let user = this.cls.get<UserEntity>('user')
        if (user) {
            user.logout = true
            await this.userRepo.save(user)
        }
        return { message: 'Successfully logged out' };
    }

    async resetPassword(params: ResetPasswordDto) {
        let user = this.cls.get<UserEntity>('user')

        validatePasswords(params.newPassword, params.repeatPassword);
        if (params.currentPassword === params.newPassword) throw new BadRequestException("New password cannot be the same as the current password");

        let checkPassword = await compare(params.currentPassword, user.password);
        if (!checkPassword) throw new BadRequestException('Current password is wrong');

        user.password = params.newPassword;

        await user.save();
        return { message: 'Password is updated successfully' };
    }
}