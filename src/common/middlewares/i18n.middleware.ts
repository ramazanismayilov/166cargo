import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class LanguageMiddleware implements NestMiddleware {
    private readonly allowedLanguages = ['az', 'en', 'ru'];

    constructor(private cls: ClsService) { }

    use(req: any, res: any, next: (error?: any) => void) {
        const lang = (req.headers['accept-language']?.split(',')[0].split(';')[0].split('-')[0].trim() || 'en');

        if (!this.allowedLanguages.includes(lang)) {
            throw new NotFoundException("The language sent is incorrect.");
        }

        this.cls.set('lang', lang);
        next();
    }
}
