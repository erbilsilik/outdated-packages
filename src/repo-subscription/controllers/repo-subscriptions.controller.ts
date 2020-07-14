import { Controller, HttpService, HttpException } from '@nestjs/common';
import { RepoSubscriptionService } from '../services/repo-subscription.service';
import { Post, Body } from '@nestjs/common';
import { RepoSubscriptionDto } from '../dto/repo-subscription.dto';
import { ConfigService } from '@nestjs/config';
import { GITHUB } from '../constants';

@Controller('repo-subscriptions')
export class RepoSubscriptionsController {
    constructor(
        private readonly repoSubscriptionService: RepoSubscriptionService,
        private httpService: HttpService,
        private configService: ConfigService,
    ) {}

    @Post()
    async create(@Body() repoSubscriptionDto: RepoSubscriptionDto) {
        try {
            const [, , , userName, repositoryName] = repoSubscriptionDto.url.split('/');
            const url = `${GITHUB.API_URL}/repos/${userName}/${repositoryName}`;
            const repoSubscription: RepoSubscriptionDto = { ...repoSubscriptionDto, url };
            await this.httpService.get(repoSubscription.url, {
                headers: {
                    'Authorization': `token ${this.configService.get<string>('GITHUB_OAUTH_TOKEN')}`,
                }
            }).toPromise();
            return await this.repoSubscriptionService.subscribe(repoSubscription);
        }
        catch(e) {
            throw new HttpException({
                status: e.response.status,
            }, e.response.status);
        }
    }
}
