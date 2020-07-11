import { Module, HttpModule } from '@nestjs/common';
import { DatabaseModule } from '../infrasturcture/database/database.module';
import { BullModule } from '@nestjs/bull';

import { RepoSubscriptionsController } from './controllers/repo-subscriptions.controller';
import { repoSubscriptionProviders } from './providers/repo-subscription.providers';
import { RepoSubscriptionService } from './services/repo-subscription.service';
import { MailProcessor } from './processors/mail-processor';
import { RepoOutDatedPackagesMailService } from './services/mail/repo-outdated-packages';

@Module({
  imports: [
    HttpModule,
    DatabaseModule,
    BullModule.registerQueueAsync({
      name: 'mail',
      useFactory: () => ({
        redis: {
          host: 'redis-13263.c85.us-east-1-2.ec2.cloud.redislabs.com',
          password: '9oqLk01pxcZ2uig0qhnUjX6oBsmiDggB',
          port: 13263,
        },
      }),
    }),
  ],
  controllers: [RepoSubscriptionsController],
  providers: [
    MailProcessor,
    RepoOutDatedPackagesMailService,
    RepoSubscriptionService, 
    ...repoSubscriptionProviders
  ],
})
export class RepoSubscriptionModule {}
