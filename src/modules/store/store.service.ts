import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { ImageEntity } from "src/entities/Image.entity";
import { StoreEntity } from "src/entities/Store.entity";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class StoreService {
    private storeRepo: Repository<StoreEntity>
    private imageRepo: Repository<ImageEntity>

    constructor(
        @InjectDataSource() private dataSource: DataSource
    ) {
        this.storeRepo = this.dataSource.getRepository(StoreEntity)
        this.imageRepo = this.dataSource.getRepository(ImageEntity)
    }

    async allStores() {
        const stores = await this.storeRepo.find({ order: { id: 'ASC' }, relations: ['image'] });
        if (stores.length === 0) throw new NotFoundException('Stores not found');

        return stores;
    }

    async addStore() { }
    async updateStore() { }
    async deleteStore() { }
}