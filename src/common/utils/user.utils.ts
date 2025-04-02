import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { I18nService } from 'nestjs-i18n';
import { UserEntity } from 'src/entities/User.entity';
import { RegisterDto } from 'src/modules/auth/dto/register.dto';
import { Repository } from 'typeorm';
import { UserType } from '../enums/user.enum';
import { Nationality } from '../enums/nationality.enum';
import { IdSerialPrefix } from '../enums/idSerialNumber.enum';

interface UniqueFieldsDto {
    email?: string;
    phone?: string;
    idSerialNumber?: string;
    idFinCode?: string;
}

@Injectable()
export class UserUtils {
    constructor(
        private i18n: I18nService,
        private cls: ClsService,
    ) { }

    async checkUniqueFields(userRepo: Repository<UserEntity>, params: UniqueFieldsDto) {
        const lang = this.cls.get('lang');
        const existingUser = await userRepo.findOne({
            where: [
                { email: params.email },
                { idSerialNumber: params.idSerialNumber },
                { idFinCode: params.idFinCode },
                { phone: params.phone }
            ]
        });

        if (existingUser) {
            if (existingUser.email === params.email) throw new ConflictException(this.i18n.t('auth.user_already_exists', { lang }));
            if (existingUser.idSerialNumber === params.idSerialNumber) throw new ConflictException(this.i18n.t('auth.idSerialNumber_already_exists', { lang }));
            if (existingUser.idFinCode === params.idFinCode) throw new ConflictException(this.i18n.t('auth.idFinCode_already_exists', { lang }));
            if (existingUser.phone === params.phone) throw new ConflictException(this.i18n.t('auth.phone_already_exists', { lang }));
        }
    };

    validatePasswords(password: string, repeatPassword: string) {
        const lang = this.cls.get('lang');
        if (password !== repeatPassword) {
            throw new BadRequestException(this.i18n.t('auth.password_not_match', { lang }));
        }
    }

    validateUserType(userType: UserType, voen?: string) {
        const lang = this.cls.get('lang');
        if (userType === UserType.INDIVIDUAL && voen) {
            throw new BadRequestException(this.i18n.t('auth.voen_required', { lang }));
        }
    }

    validateNationality(nationality?: Nationality, idSerialPrefix?: string) {
        const lang = this.cls.get('lang');
        if (nationality === Nationality.AZERBAIJAN) {
            if (idSerialPrefix !== IdSerialPrefix.AA && idSerialPrefix !== IdSerialPrefix.AZE) {
                throw new BadRequestException(this.i18n.t('auth.idSerialPrefix_azerbaijan_required', { lang }));
            }
        } else {
            if (idSerialPrefix !== IdSerialPrefix.MYI && idSerialPrefix !== IdSerialPrefix.DYI) {
                throw new BadRequestException(this.i18n.t('auth.idSerialPrefix_foreign_required', { lang }));
            }
        }
    }

}

