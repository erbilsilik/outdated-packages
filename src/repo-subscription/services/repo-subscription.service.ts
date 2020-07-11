import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { RepoSubscription } from '../interfaces/repo-subscription.interface';
import { RepoSubscriptionDto } from '../dto/repo-subscription.dto';

@Injectable()
export class RepoSubscriptionService {

    constructor(@Inject('REPO_SUBSCRIPTION_MODEL') private readonly repoSubscriptionModel: Model<RepoSubscription>) {}

    async create(repoSubscriptionDto: RepoSubscriptionDto): Promise<RepoSubscription> {
        const createdRepoSubscription = new this.repoSubscriptionModel(repoSubscriptionDto);
        return createdRepoSubscription.save();
    }

    async find(): Promise<RepoSubscription> {
        return this.repoSubscriptionModel.find();
    }
}
