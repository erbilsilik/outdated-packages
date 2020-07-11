import { Controller, HttpService, HttpException, HttpStatus } from '@nestjs/common';
import { RepoSubscriptionService } from '../services/repo-subscription.service';
import { Post, Body } from '@nestjs/common';
import { RepoSubscriptionDto } from '../dto/repo-subscription.dto';

@Controller('repo-subscriptions')
export class RepoSubscriptionsController {
    constructor(
        private readonly repoSubscriptionService: RepoSubscriptionService,
        private httpService: HttpService,
    ) {}

    @Post()
    async create(@Body() repoSubscriptionDto: RepoSubscriptionDto) {
        try {
            await this.httpService.get(repoSubscriptionDto.url).toPromise();
            return await this.repoSubscriptionService.create(repoSubscriptionDto);
        }
        catch(e) {
            throw new HttpException({
                status: HttpStatus.GATEWAY_TIMEOUT,
                error: 'Requested repository not found',
            }, HttpStatus.GATEWAY_TIMEOUT);
        }
    }
}
