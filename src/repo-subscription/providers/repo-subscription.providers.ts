import { Connection } from 'mongoose';
import { RepoSubscriptionSchema } from '../schemas/repo-subscription.schemas';

export const repoSubscriptionProviders = [
    {
        provide: 'REPO_SUBSCRIPTION_MODEL',
        useFactory: (connection: Connection) => connection.model(
            'RepoSubscription', 
            RepoSubscriptionSchema
        ),
        inject: ['DATABASE_CONNECTION'],
    },
];
