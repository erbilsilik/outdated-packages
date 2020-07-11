import { Processor, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common'
import { Job } from 'bull';
import { RepoSubscriptionService } from '../services/repo-subscription.service';
import { RepoOutDatedPackagesMailService } from '../services/mail/repo-outdated-packages';

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
      const result = await this.repoSubscriptionService.listOutdatedPackages(job.data.repoUri);
      this.repoOutDatedPackagesMailService.send();
      this.logger.debug(result);
    }
    catch(e) {
      this.logger.debug(`Error: ${e}`);
    }
    this.logger.debug('Transcoding completed');
    return {};
  }
}