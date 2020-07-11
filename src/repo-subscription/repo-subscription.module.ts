import { Module } from '@nestjs/common';
import { DatabaseModule } from '../infrasturcture/database/database.module';

import { RepoSubscriptionsController } from './controllers/repo-subscriptions.controller';
import { repoSubscriptionProviders } from './providers/repo-subscription.providers';
import { RepoSubscriptionService } from './services/repo-subscription.service';

@Module({
  imports: [DatabaseModule],
  controllers: [RepoSubscriptionsController],
  providers: [RepoSubscriptionService, ...repoSubscriptionProviders],
})
export class RepoSubscriptionModule {}
