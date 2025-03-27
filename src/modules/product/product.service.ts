import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { ProductCategoryEntity } from "src/entities/ProductCategory.entity";
import { DataSource, In, Repository } from "typeorm";
import { AddProductCategoryDto } from "./dto/addProductCategory.dto";
import { ImageEntity } from "src/entities/Image.entity";
import { StoreEntity } from "src/entities/Store.entity";

@Injectable()
export class ProductService {
    private productCategoryRepo: Repository<ProductCategoryEntity>
    private imageRepo: Repository<ImageEntity>
    private storeRepo: Repository<StoreEntity>

    constructor(
        @InjectDataSource() private dataSource: DataSource
    ) {
        this.productCategoryRepo = this.dataSource.getRepository(ProductCategoryEntity)
        this.imageRepo = this.dataSource.getRepository(ImageEntity)
        this.storeRepo = this.dataSource.getRepository(StoreEntity)
    }

    async allProducts() {
        const products = await this.productCategoryRepo.find({ order: { id: 'ASC' }, relations: ['image'] });
        if (products.length === 0) throw new NotFoundException('Products not found');

        return products;
    }

    async addProductCategory(params: AddProductCategoryDto) {
        const categoryExists = await this.productCategoryRepo.findOne({ where: { name: params.name } });
        if (categoryExists) throw new ConflictException({ message: 'Category already exists' });

        let image: ImageEntity | null = null;
        if (params.imageId) {
            image = await this.imageRepo.findOne({ where: { id: params.imageId } });
            if (!image) throw new NotFoundException({ message: 'Image not found' });
        }

        const storeIds = params.stores;

        const stores = await this.storeRepo.findBy({ id: In(storeIds) });

        if (stores.length !== storeIds.length) {
            throw new NotFoundException({ message: 'One or more stores not found' });
        }

        const productCategory = this.productCategoryRepo.create({
            name: params.name,
            image: image,
            stores: stores.map(store => ({
                store,
            }))
        });

        await this.productCategoryRepo.save(productCategory);
        return { message: 'Product category created successfully', productCategory };
    }

    async updateProduct() { }
    async deleteProduct() { }
}