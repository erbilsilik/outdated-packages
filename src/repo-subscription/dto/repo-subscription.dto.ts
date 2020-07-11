import { IsEnum, IsString } from 'class-validator';
import { Provider } from '../schemas/repo-subscription.schemas';

export class RepoSubscriptionDto {
    @IsEnum(Provider)
    readonly provider = Provider.GITHUB;
    @IsString()
    readonly url: string;
    readonly emails: string;
}
