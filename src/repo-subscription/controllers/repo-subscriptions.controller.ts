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
        const githubApi = 'https://api.github.com';
        try {
            const [, , , userName, repositoryName] = repoSubscriptionDto.url.split('/');
            const url = `${githubApi}/repos/${userName}/${repositoryName}`;
            const repoSubscription: RepoSubscriptionDto = { ...repoSubscriptionDto, url };
            await this.httpService.get(repoSubscription.url).toPromise();
            return await this.repoSubscriptionService.subscribe(repoSubscription);
        }
        catch(e) {
            throw new HttpException({
                status: HttpStatus.GATEWAY_TIMEOUT,
                error: 'Requested repository not found',
            }, HttpStatus.GATEWAY_TIMEOUT);
        }
    }
}
