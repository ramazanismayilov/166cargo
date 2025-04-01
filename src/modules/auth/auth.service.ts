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
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { ClsService } from "nestjs-cls";
import { MailerService } from "@nestjs-modules/mailer";
import * as bcrypt from 'bcrypt';
import { UserActivationEntity } from "src/entities/UserActivation.entity";
import { addMinutes } from "date-fns";
import { CreateForgetPasswordDto } from "./dto/create-forget-password.dto";
import { ConfirmForgetPaswordDto } from "./dto/confirm-forget-password.dto";
import { UserUtils } from "src/common/utils/user.utils";
import { generateNumber } from "src/common/utils/number.utils";
import { I18nService } from "nestjs-i18n";

@Injectable()
export class AuthService {
    private userRepo: Repository<UserEntity>
    private stationRepo: Repository<StationEntity>
    private userActivationRepo: Repository<UserActivationEntity>

    constructor(
        private jwt: JwtService,
        private cls: ClsService,
        private mailer: MailerService,
        private userUtils: UserUtils,
        private i18n: I18nService,
        @InjectDataSource() private dataSource: DataSource
    ) {
        this.userRepo = this.dataSource.getRepository(UserEntity)
        this.stationRepo = this.dataSource.getRepository(StationEntity)
        this.userActivationRepo = this.dataSource.getRepository(UserActivationEntity)
    }

    async login(params: LoginDto) {
        const lang = this.cls.get('lang');

        let user = await this.userRepo.findOne({ where: { email: params.email } });
        if (!user) throw new UnauthorizedException(this.i18n.t('auth.username_or_password_wrong', { lang }));

        if (user.logout) {
            user.logout = false;
            await this.userRepo.save(user);
        }

        let checkPassword = await compare(params.password, user.password);
        if (!checkPassword) throw new UnauthorizedException(this.i18n.t('auth.username_or_password_wrong', { lang }));

        let token = this.jwt.sign({ userId: user.id });

        return { message: this.i18n.t('auth.login_success_message', { lang }), token };
    }

    async register(params: RegisterDto) {
        const lang = this.cls.get('lang');
        await this.userUtils.checkUniqueFields(this.userRepo, params);

        const station = await this.stationRepo.findOne({ where: { id: params.stationId } });
        if (!station) throw new NotFoundException(this.i18n.t('station.not_found', { lang }));

        this.userUtils.validatePasswords(params.password, params.repeatPassword);
        this.userUtils.validateUserType(params.userType, params.voen);
        this.userUtils.validateNationality(params.nationality, params.idSerialPrefix);

        const hashedPassword = await bcrypt.hash(params.password, 10);

        const user = this.userRepo.create({
            email: params.email,
            password: hashedPassword,
            phonePrefix: params.phonePrefix,
            phone: params.phone,
            idSerialNumber: params.idSerialNumber,
            idSerialPrefix: params.idSerialPrefix,
            idFinCode: params.idFinCode,
            userType: params.userType,
            customerNumber: generateNumber(),
            voen: params.voen,
            profile: {
                firstName: params.firstName,
                lastName: params.lastName,
                nationality: params.nationality,
                gender: params.gender,
                birthDate: params.birthDate,
                address: params.address,
                station,
                promoCode: generateNumber()
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
        return { message: this.i18n.t('auth.register_success_message', { lang }), user };
    }

    async logOut() {
        const lang = this.cls.get('lang');
        let user = this.cls.get<UserEntity>('user')
        if (user && user.logout === false) {
            user.logout = true
            await this.userRepo.update(user.id, { logout: true });
            return { message: this.i18n.t('auth.logout_success_message', { lang }) };
        }

        return { message: this.i18n.t('auth.logout_already_message', { lang }) };
    }

    async resetPassword(params: ResetPasswordDto) {
        const lang = this.cls.get('lang');
        let user = this.cls.get<UserEntity>('user')

        this.userUtils.validatePasswords(params.newPassword, params.repeatPassword);
        if (params.currentPassword === params.newPassword) throw new BadRequestException(this.i18n.t('auth.new_password_current_password', { lang }));

        let checkPassword = await compare(params.currentPassword, user.password);
        if (!checkPassword) throw new BadRequestException(this.i18n.t('auth.current_password_wrong', { lang }));

        const hashedPassword = await bcrypt.hash(params.newPassword, 10);
        user.password = hashedPassword;

        await this.userRepo.save(user)
        return { message: this.i18n.t('auth.password_update_success_message', { lang }) };
    }

    async createForgetPasswordRequest(params: CreateForgetPasswordDto) {
        const lang = this.cls.get('lang');
        let user = await this.userRepo.findOne({ where: { email: params.email }, relations: ['profile'] });
        if (!user) throw new NotFoundException(this.i18n.t('auth.user_not_found', { lang }));

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
            return { message: this.i18n.t('auth.mail_sent_success_message', { lang }) };
        } catch (error) {
            throw new InternalServerErrorException(this.i18n.t('auth.mail_sent_error_message', { lang }));
        }
    }

    async confirmForgetPassword(params: ConfirmForgetPaswordDto) {
        const lang = this.cls.get('lang');
        let activation = await this.userActivationRepo.findOne({
            where: {
                token: params.token,
                expiredAt: MoreThan(new Date()),
            },
        });
        if (!activation) throw new BadRequestException(this.i18n.t('auth.token_invalid', { lang }));

        this.userUtils.validatePasswords(params.newPassword, params.repeatPassword)

        let user = await this.userRepo.findOne({ where: { id: activation.userId } });
        if (!user) throw new NotFoundException(this.i18n.t('auth.user_not_found', { lang }));

        const hashedPassword = await bcrypt.hash(params.newPassword, 10);
        user.password = hashedPassword;
        await this.userRepo.save(user);

        await this.userActivationRepo.delete({ userId: user.id });

        return { message: this.i18n.t('auth.password_update_success_message', { lang }) };
    }
}