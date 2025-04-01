import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
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
        const { phone, idSerialNumber, nationality, idSerialPrefix } = params;
        const user = this.cls.get<UserEntity>('user');

        const station = await this.stationRepo.findOne({ where: { id: params.stationId } });
        if (!station) throw new NotFoundException('Station not found');

        if (nationality && idSerialPrefix) {
            this.userUtils.validateNationality(nationality, idSerialPrefix);
        }

        if (phone || idSerialNumber) {
            await this.userUtils.checkUniqueFields(this.userRepo, { phone, idSerialNumber });
        }

        // Update the profile first
        await this.profileRepo.update(user.profile.id, {
            gender: params.gender,
            birthDate: params.birthDate,
            address: params.address,
        });

        // Update the user details
        await this.userRepo.update(user.id, {
            phone: params.phone,
            idSerialNumber: params.idSerialNumber,
            voen: params.voen,
        });

        // Fetch the updated user data
        const updatedUser = await this.userRepo.findOne({ where: { id: user.id }, relations: ['profile', 'station'] });

        return { message: 'Profile is updated successfully', updatedUser };
    }

    async increaseBalance(params: IncreaseBalanceDto) {
        let user = this.cls.get<UserEntity>("user");

        user.profile.balance = user.profile.balance;
        user.profile.balance += params.balance;

        await this.userRepo.save(user);
        return { message: "Balance updated successfully", balance: user.profile.balance };
    }
}