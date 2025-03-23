import { BadRequestException } from "@nestjs/common";
import { UserType } from "../enums/user.enum";
import { Nationality } from "../enums/nationality.enum";
import { IdSerialPrefix } from "../enums/idSerialNumber.enum";

export function validatePasswords(password: string, repeatPassword: string) {
    if (password !== repeatPassword) {
        throw new BadRequestException('Passwords do not match');
    }
}

export function validateUserType(userType: UserType, voen?: string) {
    if (userType === UserType.INDIVIDUAL && voen) {
        throw new BadRequestException('VOEN is not required for individuals');
    }
}

export function validateNationality(nationality: Nationality, idSerialPrefix: string) {
    if (nationality === Nationality.AZERBAIJAN) {
        if (idSerialPrefix !== IdSerialPrefix.AA && idSerialPrefix !== IdSerialPrefix.AZE) {
            throw new BadRequestException('ID Serial Prefix must be either AA or AZE for Azerbaijani nationality');
        }
    } else {
        if (idSerialPrefix !== IdSerialPrefix.MYI && idSerialPrefix !== IdSerialPrefix.DYI) {
            throw new BadRequestException('ID Serial Prefix must be either MYI or DYI for foreign citizens');
        }
    }
}
