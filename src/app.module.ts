import { Module } from '@nestjs/common';
import { RepoSubscriptionModule } from './repo-subscription/repo-subscription.module';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development.local', '.env.development'],
      isGlobal: true,
    }),
    RepoSubscriptionModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
