import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { ClsService } from "nestjs-cls";
import { UserRole } from "src/common/enums/user.enum";
import { UserEntity } from "src/entities/User.entity";
import { DataSource, Repository } from "typeorm";
import { ProfileUpdateDto } from "./dto/updateProfile.dto";
import { StationEntity } from "src/entities/Station.entity";
import { ProfileEntity } from "src/entities/Profile.entity";
import { IncreaseBalanceDto } from "./dto/increaseBalance.dto";
import { UserUtils } from "src/common/utils/user.utils";

@Injectable()
export class UserService {
    private userRepo: Repository<UserEntity>;
    private profileRepo: Repository<ProfileEntity>;
    private stationRepo: Repository<StationEntity>

    constructor(
        private cls: ClsService,
        private userUtils: UserUtils,
        @InjectDataSource() private dataSource: DataSource
    ) {
        this.userRepo = this.dataSource.getRepository(UserEntity);
        this.profileRepo = this.dataSource.getRepository(ProfileEntity);
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
        const user = this.cls.get<UserEntity>("user");
       await this.userUtils.checkUniqueFields(this.userRepo, params);
        this.userUtils.validateUserType(params.userType, params.voen);
        this.userUtils.validateNationality(params.nationality, params.idSerialPrefix);

        if (user.profile) {
            await this.profileRepo.update(user.profile.id, {
                gender: params.gender || user.profile.gender,
                birthDate: params.birthDate || user.profile.birthDate,
                nationality: params.nationality || user.profile.nationality,
                address: params.address || user.profile.address,
            });
        }

        await this.userRepo.update(user.id, {
            phonePrefix: params.phonePrefix || user.phonePrefix,
            phone: params.phone || user.phone,
            idSerialPrefix: params.idSerialPrefix || user.idSerialPrefix,
            idSerialNumber: params.idSerialNumber || user.idSerialNumber,
            voen: params.voen || user.voen,
        });

        const updatedUser = await this.userRepo.findOne({ where: { id: user.id }, relations: ['profile'] });
        return { message: "Profile updated successfully", updatedUser };
    }

    async increaseBalance(params: IncreaseBalanceDto) {
        let user = this.cls.get<UserEntity>("user");

        user.profile.balance = user.profile.balance;
        user.profile.balance += params.balance;

        await this.userRepo.save(user);
        return { message: "Balance updated successfully", balance: user.profile.balance };
    }
}