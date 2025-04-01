import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { NewsService } from "./news.service";
import { UserRole } from "src/common/enums/user.enum";
import { Auth } from "src/common/decorators/auth.decorator";
import { AddNewsDto } from "./dto/addNews.dto";
import { UpdateNewsDto } from "./dto/updateNews.dto";

@Controller('news')
export class NewsController {
    constructor(private newsService: NewsService) { }

    @Get()
    allNews() {
        return this.newsService.allNews()
    }

    @Post()
    @Auth(UserRole.ADMIN)
    addNews(@Body() body: AddNewsDto) {
        return this.newsService.addNews(body)
    }

    @Post(':id')
    @Auth(UserRole.ADMIN)
    updateNews(@Param('id') id: number, @Body() body: UpdateNewsDto) {
        return this.newsService.updateNews(id, body)
    }

    @Delete(':id')
    @Auth(UserRole.ADMIN)
    deleteNews(@Param('id') id: number) {
        return this.newsService.deleteNews(id)
    }
}