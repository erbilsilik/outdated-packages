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
  async transcode(job: Job<any>) {
    this.logger.debug('Start transcoding...');
    this.logger.debug(job.data);
    try {
      const outdatedPackages = await this.repoSubscriptionService.listOutdatedPackages(
        job.data.repoUri, 'Javascript' // fix this
      );
      this.repoOutDatedPackagesMailService.send(
        job.data.emails, 
        { packageInfo: job.data, outdatedPackages }
      );
      this.logger.debug(outdatedPackages);
    }
    catch(e) {
      this.logger.debug(`Error: ${e} from transcoding`);
    }
    this.logger.debug('Transcoding completed');
    return {};
  }
}