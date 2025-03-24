import { ConflictException } from '@nestjs/common';
import { UserEntity } from 'src/entities/User.entity';
import { RegisterDto } from 'src/modules/auth/dto/register.dto';
import { Repository } from 'typeorm';

interface UniqueFieldsDto {
    email?: string;
    phone?: string;
    idSerialNumber?: string;
    idFinCode?: string;
  }

export const checkUniqueFields = async (userRepo: Repository<UserEntity>, params: UniqueFieldsDto) => {
    const existingUser = await userRepo.findOne({
        where: [
            { email: params.email },
            { idSerialNumber: params.idSerialNumber },
            { idFinCode: params.idFinCode },
            { phone: params.phone }
        ]
    });

    if (existingUser) {
        if (existingUser.email === params.email) throw new ConflictException('Email already exists');
        if (existingUser.idSerialNumber === params.idSerialNumber) throw new ConflictException('IdSerialNumber already exists');
        if (existingUser.idFinCode === params.idFinCode) throw new ConflictException('IdFinCode already exists');
        if (existingUser.phone === params.phone) throw new ConflictException('Phone already exists');
    }
};
