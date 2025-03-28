import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource, In, Repository } from "typeorm";
import { ImageEntity } from "src/entities/Image.entity";
import { StoreEntity } from "src/entities/Store.entity";
import { CategoryEntity } from "src/entities/Category.entity";
import { AddCategoryDto } from "./dto/addCategory.dto";
import { UpdateCategoryDto } from "./dto/updateCategory.dto";
import { CategoryStoreEntity } from "src/entities/CategoryStore.entity";

@Injectable()
export class CategoryService {
    private categoryRepo: Repository<CategoryEntity>
    private categoryStoreRepo: Repository<CategoryStoreEntity>
    private storeRepo: Repository<StoreEntity>
    private imageRepo: Repository<ImageEntity>

    constructor(
        @InjectDataSource() private dataSource: DataSource
    ) {
        this.categoryRepo = this.dataSource.getRepository(CategoryEntity)
        this.storeRepo = this.dataSource.getRepository(StoreEntity)
        this.categoryStoreRepo = this.dataSource.getRepository(CategoryStoreEntity)
        this.imageRepo = this.dataSource.getRepository(ImageEntity)
    }

    async allCategories() {
        const categories = await this.categoryRepo.find({ order: { id: 'ASC' }, relations: ['image'] });
        if (categories.length === 0) throw new NotFoundException('Categories not found');

        return categories;
    }

    async addCategory(params: AddCategoryDto) {
        const categoryExists = await this.categoryRepo.findOne({ where: { name: params.name } });
        if (categoryExists) throw new ConflictException({ message: 'Category already exists' });

        const image = params.imageId
            ? await this.imageRepo.findOne({ where: { id: params.imageId } })
            : null;
        if (params.imageId && !image) throw new NotFoundException({ message: 'Image not found' });

        const storeIds = params.stores || [];
        const stores = storeIds.length > 0 ? await this.storeRepo.findBy({ id: In(storeIds) }) : [];
        if (stores.length !== storeIds.length) throw new NotFoundException({ message: 'Stores not found' });

        const category = this.categoryRepo.create({
            name: params.name,
            image: image,
        });
        await this.categoryRepo.save(category);

        const categoryStores = stores.map(store => {
            return this.categoryStoreRepo.create({
                category,
                store
            });
        });

        await this.categoryStoreRepo.save(categoryStores);

        return { message: 'Category created successfully', category };
    }

    async updateCategory(id: number, params: UpdateCategoryDto) {
        let category = await this.categoryRepo.findOne({
            where: { id },
            relations: ['image', 'categoryStores'],
        });
        if (!category) throw new NotFoundException({ message: 'Category not found' });

        let image = params.imageId
            ? await this.imageRepo.findOne({ where: { id: params.imageId } })
            : category.image;
        if (params.imageId && !image) throw new NotFoundException({ message: 'Image not found' });

        const storeIds = params.stores || [];
        const stores = storeIds.length > 0 ? await this.storeRepo.findBy({ id: In(storeIds) }) : [];
        if (stores.length !== storeIds.length) throw new NotFoundException({ message: 'Stores not found' });

        await this.categoryStoreRepo.delete({ category: { id } });

        const newCategoryStores = stores.map(store => this.categoryStoreRepo.create({ category, store }));
        await this.categoryStoreRepo.save(newCategoryStores);

        await this.categoryRepo.save({
            ...category,
            ...params,
            image: image !== null ? image : category.image,
            categoryStores: newCategoryStores,
        });

        const updatedCategory = await this.categoryRepo.findOne({
            where: { id },
            relations: ['image', 'categoryStores', 'categoryStores.store'],
        });

        return { message: "Category updated successfully", updatedCategory };
    }

    async deletecategory(categoryId: number) {
        let category = await this.categoryRepo.findOne({ where: { id: categoryId } });
        if (!category) throw new NotFoundException({ message: 'Category not found' });

        await this.categoryRepo.delete(categoryId);
        return { message: "Category deleted successfully" };
    }
}