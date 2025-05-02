import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { ImageEntity } from "src/entities/Image.entity";
import { StoreEntity } from "src/entities/Store.entity";
import { DataSource, Repository } from "typeorm";
import { AddStoreDto } from "./dto/addStore.dto";
import { UpdateStoreDto } from "./dto/updateStore.dto";
import { CategoryEntity } from "src/entities/Category.entity";
import { CategoryStoreEntity } from "src/entities/CategoryStore.entity";

@Injectable()
export class StoreService {
    private storeRepo: Repository<StoreEntity>
    private imageRepo: Repository<ImageEntity>
    private categoryStoreRepo: Repository<CategoryStoreEntity>

    constructor(
        @InjectDataSource() private dataSource: DataSource
    ) {
        this.storeRepo = this.dataSource.getRepository(StoreEntity)
        this.imageRepo = this.dataSource.getRepository(ImageEntity)
        this.categoryStoreRepo = this.dataSource.getRepository(CategoryStoreEntity)
    }

    async allStores() {
        const stores = await this.storeRepo.find({ order: { id: 'ASC' }, relations: ['image'] });
        if (stores.length === 0) throw new NotFoundException('Stores not found');

        return stores;
    }

    async getCategoriesByStoreId(storeId: number): Promise<CategoryEntity[]> {
        const categoryStores = await this.categoryStoreRepo.find({
            where: { store: { id: storeId } },
            relations: ['category', 'category.image'],
        });
        if (categoryStores.length === 0) throw new NotFoundException('Not found')

        return categoryStores.map(cs => cs.category);
    }

    async addStore(params: AddStoreDto) {
        const storeExists = await this.storeRepo.findOne({ where: { name: params.name } });
        if (storeExists) throw new ConflictException({ message: 'Store already exists' });

        const image = params.imageId
            ? await this.imageRepo.findOne({ where: { id: params.imageId } })
            : null;
        if (params.imageId && !image) throw new NotFoundException({ message: 'Image not found' });

        const store = this.storeRepo.create({ ...params, image })
        await this.storeRepo.save(store);
        return { message: "Store created successfully", store };
    }

    async updateStore(id: number, params: UpdateStoreDto) {
        const store = await this.storeRepo.findOne({ where: { id }, relations: ['image'] });
        if (!store) throw new NotFoundException({ message: 'Store not found' });

        const image = params.imageId
            ? await this.imageRepo.findOne({ where: { id: params.imageId } })
            : store.image;
        if (params.imageId && !image) throw new NotFoundException({ message: 'Image not found' });

        const updatedNews = await this.storeRepo.save({
            ...store,
            ...params,
            image: image !== null ? image : store.image,
        });
        return { message: "Store updated successfully", updatedNews };
    }

    async deleteStore(storeId: number) {
        let store = await this.storeRepo.findOne({ where: { id: storeId } });
        if (!store) throw new NotFoundException({ message: 'Store not found' });

        await this.storeRepo.delete(storeId);
        return { message: "Store deleted successfully" };
    }
}