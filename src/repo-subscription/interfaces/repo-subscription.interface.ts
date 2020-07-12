import { Document } from 'mongoose';

export interface RepoSubscription extends Document {
    readonly url: string;
    readonly emails: Array<string>;
}
