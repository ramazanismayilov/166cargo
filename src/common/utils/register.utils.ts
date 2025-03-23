import { BadRequestException } from "@nestjs/common";
import { UserType } from "../enums/user.enum";
import { Nationality } from "../enums/nationality.enum";
import { IdSerialNumber } from "../enums/idSerialNumber.enum";

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

export function validateNationality(nationality: Nationality, idSerialNumber: string) {
    if (nationality === Nationality.AZERBAIJAN) {
        if (idSerialNumber !== IdSerialNumber.AA && idSerialNumber !== IdSerialNumber.AZE) {
            throw new BadRequestException('ID Serial Number must be either AA or AZE for Azerbaijani nationality');
        }
    } else {
        if (idSerialNumber !== IdSerialNumber.MYI && idSerialNumber !== IdSerialNumber.DYI) {
            throw new BadRequestException('ID Serial Number must be either MYI or DYI for foreign citizens');
        }
    }
}
