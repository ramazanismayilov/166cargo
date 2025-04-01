import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { NewsEntity } from "src/entities/News.entity";
import { DataSource, In, Repository } from "typeorm";
import { AddNewsDto } from "./dto/addNews.dto";
import { UpdateNewsDto } from "./dto/updateNews.dto";
import { ImageEntity } from "src/entities/Image.entity";

@Injectable()
export class NewsService {
    private newsRepo: Repository<NewsEntity>
    private imageRepo: Repository<ImageEntity>
    constructor(
        @InjectDataSource() private dataSource: DataSource
    ) {
        this.newsRepo = this.dataSource.getRepository(NewsEntity)
        this.imageRepo = this.dataSource.getRepository(ImageEntity)
    }

    async allNews() {
        const news = await this.newsRepo.find({ order: { id: 'ASC' }, relations: ['image'] });
        if (news.length === 0) throw new NotFoundException('News not found');

        return news;
    }

    async addNews(params: AddNewsDto) {
        const newsExists = await this.newsRepo.findOne({ where: { title: params.title } });
        if (newsExists) throw new ConflictException({ message: 'News already exists' });

        const image = await this.imageRepo.findOne({ where: { id: params.imageId } })
        if (!image) throw new NotFoundException({ message: 'Image not found' });

        const news = this.newsRepo.create({ ...params, image })
        await this.newsRepo.save(news);
        return { message: "News created successfully", news };
    }

    async updateNews(id: number, params: UpdateNewsDto) {
        const news = await this.newsRepo.findOne({ where: { id }, relations: ['image'] });
        if (!news) throw new NotFoundException({ message: 'News not found' });
    
        if (params.imageId) {
            const image = await this.imageRepo.findOne({ where: { id: params.imageId } });
            if (!image) throw new NotFoundException({ message: 'Image not found' });
            news.image = image;
        }
    
        Object.assign(news, params);
        await this.newsRepo.save(news);
    
        const { imageId, ...cleanedNews } = news as any;
        return { message: "News updated successfully", updatedNews: cleanedNews };
    }

    async deleteNews(newsId: number) {
        let news = await this.newsRepo.findOne({ where: { id: newsId } });
        if (!news) throw new NotFoundException({ message: 'News not found' });

        await this.newsRepo.delete(newsId);
        return { message: "News deleted successfully" };
    }
}