import { Processor, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common'
import { Job } from 'bull';
import { RepoSubscriptionService } from '../services/repo-subscription.service';
import { RepoOutDatedPackagesMailService } from '../services/mail/repo-outdated-packages-mail.service';

@Processor('mail')
export class MailProcessor {
  constructor(
    private readonly repoSubscriptionService: RepoSubscriptionService,
    private readonly repoOutDatedPackagesMailService: RepoOutDatedPackagesMailService,
    ) {}
  private readonly logger = new Logger(MailProcessor.name);
  @Process()
  async process(job: Job<any>) {
    this.logger.debug('Start processing...');
    this.logger.debug(job.data);
    try {
      const packageFiles = await this.repoSubscriptionService.listOutdatedPackages(job.data.repoUri);
      this.logger.debug(packageFiles);
      this.repoOutDatedPackagesMailService.send(
        job.data.emails, 
        { packageInfo: job.data, packageFiles }
      );
      this.logger.debug(packageFiles);
    }
    catch(e) {
      this.logger.debug(`Error: ${e} from processing`);
    }
    this.logger.debug('Processing completed');
    return {};
  }
}