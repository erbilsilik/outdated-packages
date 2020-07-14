import { Processor, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common'
import { Job } from 'bull';
import { RepoSubscriptionService } from '../../services/repo-subscription.service';
import { OutdatedPackageMailService } from '../../mail/outdated-package-mail.service';

@Processor('mail')
export class OutdatedPackageMailProcessor {
  constructor(
    private readonly repoSubscriptionService: RepoSubscriptionService,
    private readonly outdatedPackagesMailService: OutdatedPackageMailService,
    ) {}
  private readonly logger = new Logger(OutdatedPackageMailProcessor.name);
  @Process()
  async process(job: Job<any>) {
    this.logger.debug('Start processing...');
    this.logger.debug(job.data);
    try {
      const packageFiles = await this.repoSubscriptionService.listOutdatedPackages(job.data.repoUri);
      this.logger.debug(packageFiles);
      this.outdatedPackagesMailService.send(
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