import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
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
        return await this.imageRepo.find();
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
        const image = await this.imageRepo.findOne({ where: { id } });
        if (!image) throw new Error('Image not found');

        await this.imageRepo.remove(image);
        return { message: "Image deleted succesfully" }
    }
}