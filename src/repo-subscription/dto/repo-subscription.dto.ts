import { IsEmail, Matches } from 'class-validator';
import { GITHUB } from '../constants';

export class RepoSubscriptionDto {
    @Matches(/https:\/\/github.com/, { 
        message:
        `only the following provider is supported: ${GITHUB.HTML_URL}` 
    })
    readonly url: string;
    @IsEmail({}, { each: true })
    readonly emails: string[];
}
