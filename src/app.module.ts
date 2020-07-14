import { Module } from '@nestjs/common';
import { RepoSubscriptionModule } from './repo-subscription/repo-subscription.module';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development.local', '.env.development'],
      isGlobal: true,
    }),
    RepoSubscriptionModule,
  ],
})
export class AppModule {}
