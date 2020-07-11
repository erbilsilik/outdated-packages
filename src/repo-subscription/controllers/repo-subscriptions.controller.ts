import { Controller } from '@nestjs/common';
import { RepoSubscriptionService } from '../services/repo-subscription.service';
import { Post, Get, Body } from '@nestjs/common';
import { RepoSubscriptionDto } from '../dto/repo-subscription.dto';
import { RepoSubscription } from '../interfaces/repo-subscription.interface';


@Controller('repo-subscriptions')
export class RepoSubscriptionsController {
    constructor(private readonly repoSubscriptionService: RepoSubscriptionService) {}

    @Post()
    async create(@Body() repoSubscriptionDto: RepoSubscriptionDto) {
        return await this.repoSubscriptionService.create(repoSubscriptionDto);
    }

    @Get()
    async find(): Promise<RepoSubscription> {
        return await this.repoSubscriptionService.find();
    }
}
