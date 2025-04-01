import { Controller, Get, Headers } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

    @Get('hello')
    async getHello(@Headers('x-custom-lang') lang: string): Promise<string> {
        return this.appService.getHello(lang || 'en'); 
    }

}
