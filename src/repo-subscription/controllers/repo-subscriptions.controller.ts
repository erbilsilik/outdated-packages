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
            const [, , , userName, repositoryName] = repoSubscriptionDto.url.split('/');
            const url = `https://api.github.com/repos/${userName}/${repositoryName}`;
            const repoSubscription: RepoSubscriptionDto = { ...repoSubscriptionDto, url };
            const { data: repository } = await this.httpService.get(repoSubscription.url).toPromise();
            const { data: languages } = await this.httpService.get(repository.languages_url).toPromise(); 
            const repositoryLanguage = Object.keys(languages).reduce((a, b) => languages[a] > languages[b] ? a : b);
            return await this.repoSubscriptionService.subscribe(repoSubscription, repositoryLanguage);
        }
        catch(e) {
            throw new HttpException({
                status: HttpStatus.GATEWAY_TIMEOUT,
                error: 'Requested repository not found',
            }, HttpStatus.GATEWAY_TIMEOUT);
        }
    }
}
