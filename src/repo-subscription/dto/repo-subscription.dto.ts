import { IsEmail, Matches } from 'class-validator';

const githubUrl = 'https://github.com';

export class RepoSubscriptionDto {
    @Matches(/https:\/\/github.com/, { 
        message:
        `only the following provider is supported: ${githubUrl}` 
    })
    readonly url: string;
    @IsEmail({}, { each: true })
    readonly emails: string[];
}
