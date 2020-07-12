import { IsEmail, Matches } from 'class-validator';

const githubUrl = 'https://github.com';
const bitbucketUrl = 'https://bitbucket.com';
const gitlabUrl = 'https://gitlab.com';

// enum Provider {
//     GITHUB = 'github',
//     GITLAB = 'bitbucket',
//     BITBUCKET = 'gitlab',
// };
export class RepoSubscriptionDto {
    //@Matches(/^https:\/\.github\.com|https:\/\.bitbucket\.com|https:\/\.gitlab\.com/, { 
    @Matches(/https:\/\/github.com/, { 
        message:
        `only the following providers are supported: ${githubUrl} - ${bitbucketUrl} - ${gitlabUrl} ` 
    })
    readonly url: string;
    @IsEmail({}, { each: true })
    readonly emails: string[];
}
