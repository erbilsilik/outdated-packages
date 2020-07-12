import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { NestExpressApplication, ExpressAdapter } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const server = express();
  server.locals.basedir = join(__dirname, '..', 'views');
  const app = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter(server));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('pug');
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
