import { ConflictException, Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { ProfileEntity } from "src/entities/Profile.entity";
import { UserEntity } from "src/entities/User.entity";
import { DataSource, Repository } from "typeorm";
import { RegisterDto } from "./dto/register.dto";
import { v4 } from "uuid";
import { Nationality } from "src/common/enums/nationality.enum";

@Injectable()
export class AuthService {
    private userRepo: Repository<UserEntity>
    private profileRepo: Repository<ProfileEntity>

    constructor(
        @InjectDataSource() private dataSource: DataSource
    ) {
        this.userRepo = this.dataSource.getRepository(UserEntity),
            this.profileRepo = this.dataSource.getRepository(ProfileEntity)
    }

    async register(params: RegisterDto) {
        const userExists = await this.userRepo.findOne({ where: { email: params.email } });
        if (userExists) throw new ConflictException({ message: 'User is already exists' });

        const user = this.userRepo.create({
            email: params.email,
            password: params.password,
            phone: params.phone,
            idSerialNumber: params.idSerialNumber,
            idFinCode: params.idFinCode,
            customerNumber: v4(),
            loginDate: new Date(),
            voen: params.voen,
            profile: {
                firstName: params.firstName,
                lastName: params.lastName,
                gender: params.gender,
                birthDate: params.birthDate,
                address: params.address,
                station: params.station,
                coupon: v4(),
                promoDate: new Date(),
            }
        });
        await user.save();

        return { message: "Signup is successfully", user };
    }
}