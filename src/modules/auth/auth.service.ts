import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { ProfileEntity } from "src/entities/Profile.entity";
import { UserEntity } from "src/entities/User.entity";
import { DataSource, Repository } from "typeorm";
import { RegisterDto } from "./dto/register.dto";
import { v4 } from "uuid";
import { Nationality } from "src/common/enums/nationality.enum";
import { StationEntity } from "src/entities/Station.entity";

@Injectable()
export class AuthService {
    private userRepo: Repository<UserEntity>
    private profileRepo: Repository<ProfileEntity>
    private stationRepo: Repository<StationEntity>

    constructor(
        @InjectDataSource() private dataSource: DataSource
    ) {
        this.userRepo = this.dataSource.getRepository(UserEntity)
        this.profileRepo = this.dataSource.getRepository(ProfileEntity)
        this.stationRepo = this.dataSource.getRepository(StationEntity)
    }

    async register(params: RegisterDto) {
        const userExists = await this.userRepo.findOne({ where: { email: params.email } });
        if (userExists) throw new ConflictException({ message: 'User already exists' });

        const station = await this.stationRepo.findOne({ where: { id: params.stationId } });
        if (!station) throw new NotFoundException({ message: 'Station not found' });

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
                station,
                coupon: v4(),
                promoDate: new Date(),
            }
        });
        await user.save();

        return { message: "Signup is successfully", user };
    }
}