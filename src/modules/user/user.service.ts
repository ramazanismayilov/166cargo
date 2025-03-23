import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { UserEntity } from "src/entities/User.entity";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class UserService {
    private userRepo: Repository<UserEntity>;
    constructor(
        @InjectDataSource() private dataSource: DataSource
    ) {
        this.userRepo = this.dataSource.getRepository(UserEntity);
    }

    async getUser(id: number) {
        return await this.userRepo.findOne({ where: { id } });
    }
}