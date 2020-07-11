import * as mongoose from 'mongoose';

export enum Provider {
    GITHUB = 0,
    GITLAB = 1,
    BITBUCKET = 2,
}

export const RepoSubscriptionSchema = new mongoose.Schema({
    proivder: { type: Provider, required: true, default: Provider.GITHUB },
    url: {type: String, required: true },
    emails: {type: Array, required: true },
}, {
    timestamps: true,
});
