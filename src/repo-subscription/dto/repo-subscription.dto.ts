import { IsEnum, IsEmail, Matches } from 'class-validator';
import { Provider } from '../schemas/repo-subscription.schemas';

const githubApi = 'https://api.github.com/repos/';
const bitbucketApi = 'https://api.bitbucket.com/repos/';
const gitlabApi = 'https://api.gitlab.com/repos/';

export class RepoSubscriptionDto {
    @IsEnum(Provider,  { 
        message: 
        `only following providers are supported: ${Provider.GITHUB} - ${Provider.BITBUCKET} - ${Provider.GITLAB} ` 
    })
    readonly provider = Provider.GITHUB;
    @Matches(/^https:\/\/api\.github\.com\/repos\/|https:\/\/api\.bitbucket\.com\/repos\/|https:\/\/api\.gitlab\.com\/repos\//, { 
        message:
        `only following API's are supported: ${githubApi} - ${bitbucketApi} - ${gitlabApi} ` 
    })
    readonly url: string;
    @IsEmail({}, { each: true })
    readonly emails: string[];
}
