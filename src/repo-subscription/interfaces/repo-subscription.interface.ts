import { Document } from 'mongoose';
import { Provider } from '../schemas/repo-subscription.schemas';

export interface RepoSubscription extends Document {
    readonly provider: Provider;
    readonly url: string;
    readonly emails: Array<string>;
}
