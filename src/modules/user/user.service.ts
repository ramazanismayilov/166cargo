import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { ClsService } from "nestjs-cls";
import { UserRole } from "src/common/enums/user.enum";
import { UserEntity } from "src/entities/User.entity";
import { DataSource, Repository } from "typeorm";
import { checkUniqueFields } from "src/common/utils/user.utils";
import { ProfileUpdateDto } from "./dto/updateProfile.dto";
import { StationEntity } from "src/entities/Station.entity";

@Injectable()
export class UserService {
    private userRepo: Repository<UserEntity>;
    private stationRepo: Repository<StationEntity>

    constructor(
        private cls: ClsService,
        @InjectDataSource() private dataSource: DataSource
    ) {
        this.userRepo = this.dataSource.getRepository(UserEntity);
        this.stationRepo = this.dataSource.getRepository(StationEntity)
    }

    async getUsers() {
        let user = await this.userRepo.find({ relations: ['profile'] });
        if (!user) throw new NotFoundException('User not found')
        return user
    }

    async getUser(userId: number) {
        let user = await this.userRepo.findOne({ where: { id: userId }, relations: ['profile'] });
        if (!user) throw new NotFoundException('User not found')
        return user
    }

    async deleteUser(userId: number) {
        const currentUser = this.cls.get<UserEntity>('user');

        const userToDelete = await this.userRepo.findOne({ where: { id: userId } });
        if (!userToDelete) throw new NotFoundException('User not found');

        if (currentUser.role === UserRole.ADMIN) {
            await this.userRepo.remove(userToDelete);
            return { message: 'User has been successfully deleted' };
        }

        if (currentUser.id !== userId) {
            throw new ForbiddenException({ message: 'You can only delete your own account' });
        }

        await this.userRepo.remove(userToDelete);
        return { message: 'Your account has been successfully deleted' };
    }

    async updateProfile(params: ProfileUpdateDto) {
        const user = this.cls.get<UserEntity>('user')

        const station = await this.stationRepo.findOne({ where: { id: params.stationId } });
        if (!station) throw new NotFoundException('Station not found');

        const { email, phone, idSerialNumber, idFinCode } = params;

        if (email || phone || idSerialNumber || idFinCode) {
            await checkUniqueFields(this.userRepo, { email, phone, idSerialNumber, idFinCode });
        }

        await this.userRepo.update(user.id, {
            email: params.email,
            phone: params.phone,
            idSerialNumber: params.idSerialNumber,
            idFinCode: params.idFinCode,
            voen: params.voen,
            profile: {
                firstName: params.firstName,
                lastName: params.lastName,
                gender: params.gender,
                birthDate: params.birthDate,
                station,
                address: params.address,
            }
        });
        await this.userRepo.update(user.id, params)

        return { message: 'Profile is updated successfully' }
    }
}