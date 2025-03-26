import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { UserEntity } from "src/entities/User.entity";
import { DataSource, MoreThan, Repository } from "typeorm";
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
import * as bcrypt from 'bcrypt';
import { UserActivationEntity } from "src/entities/UserActivation.entity";
import { addMinutes } from "date-fns";
import { CreateForgetPasswordDto } from "./dto/create-forget-password.dto";
import { ConfirmForgetPaswordDto } from "./dto/confirm-forget-password.dto";
import { checkUniqueFields } from "src/common/utils/user.utils";

@Injectable()
export class AuthService {
    private userRepo: Repository<UserEntity>
    private stationRepo: Repository<StationEntity>
    private userActivationRepo: Repository<UserActivationEntity>

    constructor(
        private jwt: JwtService,
        private cls: ClsService,
        private mailer: MailerService,
        @InjectDataSource() private dataSource: DataSource
    ) {
        this.userRepo = this.dataSource.getRepository(UserEntity)
        this.stationRepo = this.dataSource.getRepository(StationEntity)
        this.userActivationRepo = this.dataSource.getRepository(UserActivationEntity)
    }

    async login(params: LoginDto) {
        let user = await this.userRepo.findOne({ where: { email: params.email } });
        if (!user) throw new UnauthorizedException('Username or password is wrong');

        if (user.logout) {
            user.logout = false;
            await this.userRepo.save(user);
        }

        let checkPassword = await compare(params.password, user.password);
        if (!checkPassword) throw new UnauthorizedException('Username or password is wrong');

        let token = this.jwt.sign({ userId: user.id });

        return { message: "Login is successfully", token };
    }

    async register(params: RegisterDto) {
        await checkUniqueFields(this.userRepo, params);

        const station = await this.stationRepo.findOne({ where: { id: params.stationId } });
        if (!station) throw new NotFoundException('Station not found');

        validatePasswords(params.password, params.repeatPassword);
        validateUserType(params.userType, params.voen);
        validateNationality(params.nationality, params.idSerialPrefix);

        const hashedPassword = await bcrypt.hash(params.password, 10);

        const user = this.userRepo.create({
            email: params.email,
            password: hashedPassword,
            phone: params.phone,
            idSerialNumber: params.idSerialNumber,
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

        await this.userRepo.save(user)
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
            await this.userRepo.update(user.id, { logout: true });
        }
        return { message: 'Successfully logged out' };
    }

    async resetPassword(params: ResetPasswordDto) {
        let user = this.cls.get<UserEntity>('user')

        validatePasswords(params.newPassword, params.repeatPassword);
        if (params.currentPassword === params.newPassword) throw new BadRequestException("New password cannot be the same as the current password");

        let checkPassword = await compare(params.currentPassword, user.password);
        if (!checkPassword) throw new BadRequestException('Current password is wrong');

        const hashedPassword = await bcrypt.hash(params.newPassword, 10);
        user.password = hashedPassword;

        await this.userRepo.save(user)
        return { message: 'Password is updated successfully' };
    }

    async createForgetPasswordRequest(params: CreateForgetPasswordDto) {
        let user = await this.userRepo.findOne({ where: { email: params.email }, relations: ['profile'] });
        if (!user) throw new NotFoundException('User is not found');
        if (!user.profile) throw new NotFoundException('User profile is not found');

        let activation = await this.userActivationRepo.findOne({
            where: {
                userId: user.id,
                expiredAt: MoreThan(new Date()),
            },
        });

        if (!activation) {
            activation = this.userActivationRepo.create({
                userId: user.id,
                token: v4(),
                expiredAt: addMinutes(new Date(), 30),
            });
        }

        const resetLink = `${params.callbackURL}?token=${activation.token}`;
        try {
            await this.mailer.sendMail({
                to: user.email,
                subject: `Forgot Password Request`,
                template: 'forget-password',
                context: {
                    firstName: user.profile.firstName,
                    resetLink,
                },
            })

            await this.userActivationRepo.save(activation)
            return { message: 'Mail has been successfully sent' };
        } catch (error) {
            throw new InternalServerErrorException('Due some reasons, we cannot send mail for forgot-password');
        }
    }

    async confirmForgetPassword(params: ConfirmForgetPaswordDto) {
        let activation = await this.userActivationRepo.findOne({
            where: {
                token: params.token,
                expiredAt: MoreThan(new Date()),
            },
        });
        if (!activation) throw new BadRequestException('Token is not valid');

        validatePasswords(params.newPassword, params.repeatPassword)

        let user = await this.userRepo.findOne({ where: { id: activation.userId } });
        if (!user) throw new NotFoundException('User not found');

        const hashedPassword = await bcrypt.hash(params.newPassword, 10);
        user.password = hashedPassword;
        await this.userRepo.save(user);

        await this.userActivationRepo.delete({ userId: user.id });

        return { message: 'Password is successfully updated' };
    }
}