import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { isUUID } from "class-validator";
import { ImageEntity } from "src/entities/Image.entity";
import { CloudinaryService } from "src/libs/cloudinary/cloudinary.service";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class UploadService {
    private imageRepo: Repository<ImageEntity>;

    constructor(
        private cloudinaryService: CloudinaryService,
        @InjectDataSource() private dataSoruce: DataSource,
    ) {
        this.imageRepo = this.dataSoruce.getRepository(ImageEntity);
    }

    async allImages() {
        const images = await this.imageRepo.find({ order: { id: 'ASC' } })
        if (images.length === 0) throw new NotFoundException('Images not found');

        return images
    }

    async uploadImage(file: Express.Multer.File) {
        try {
            let result = await this.cloudinaryService.uploadFile(file);
            if (!result?.url) throw new Error();

            let image = this.imageRepo.create({
                url: result.url,
            });

            await image.save();

            return image;
        } catch {
            throw new BadRequestException('Something went wrong');
        }
    }

    async deleteImage(id: string) {
        if (!isUUID(id)) {
            throw new BadRequestException('Image id type is wrong');
        }
    
        const image = await this.imageRepo.findOne({ where: { id } });
        if (!image) {
            throw new NotFoundException('Image not found');
        }
    
        await this.imageRepo.remove(image);
        return { message: "Image deleted successfully" };
    }
}