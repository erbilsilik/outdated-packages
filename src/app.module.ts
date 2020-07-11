import { Module } from '@nestjs/common';
import { RepoSubscriptionModule } from './repo-subscription/repo-subscription.module';
import { ConfigModule } from '@nestjs/config';
// import { DatabaseModule } from './infrasturcture/database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development.local', '.env.development'],
      isGlobal: true,
    }),
    // DatabaseModule,
    RepoSubscriptionModule,
  ],
  providers: [],
})
export class AppModule {}
