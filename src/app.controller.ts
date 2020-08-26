import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Mixed } from './mixed.decorator';
import { MixedDTO } from './mixed.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('optionals')
  postOptionals(@Mixed() mixedBodyAndQuery: MixedDTO): string {
    console.log(mixedBodyAndQuery);
    return 'all good';
  }
}
