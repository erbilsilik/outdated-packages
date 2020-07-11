import * as mongoose from 'mongoose';

export enum Provider {
    GITHUB = 'github',
    GITLAB = 'bitbucket',
    BITBUCKET = 'gitlab',
};

export const RepoSubscriptionSchema = new mongoose.Schema({
    proivder: { type: Provider, required: true, default: Provider.GITHUB },
    url: { type: String, required: true },
    emails: { type: Array, required: true },
}, {
    timestamps: true,
});
