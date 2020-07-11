import { Controller } from '@nestjs/common';
import { RepoSubscriptionService } from '../services/repo-subscription.service';
import { Get, Post, Body } from '@nestjs/common';
import { RepoSubscriptionDto } from '../dto/repo-subscription.dto';


@Controller('repo-subscriptions')
export class RepoSubscriptionsController {
    constructor(private readonly repoSubscriptionService: RepoSubscriptionService) {}

    @Post()
    async create(@Body() repoSubscriptionDto: RepoSubscriptionDto) {
        return await this.repoSubscriptionService.create(repoSubscriptionDto);
    }
}
