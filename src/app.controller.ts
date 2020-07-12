import { Controller, Render } from '@nestjs/common';
import { Get } from '@nestjs/common';

@Controller()
export class AppController {

    @Get()
    @Render('home')
    async index() {
        return;
    }
}
