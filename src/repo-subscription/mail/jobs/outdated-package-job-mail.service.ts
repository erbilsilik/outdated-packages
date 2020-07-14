import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectEventEmitter } from 'nest-emitter';
import { MailEventEmitter } from 'src/repo-subscription/events/app.events';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { RepoSubscription } from 'src/repo-subscription/interfaces/repo-subscription.interface';

@Injectable()
export class OutdatedPackageJobMailService implements OnModuleInit {
  constructor(
      @InjectEventEmitter() private readonly emitter: MailEventEmitter,
      @InjectQueue('mail') private mailQueue: Queue,
  ) {}
  private readonly logger = new Logger(OutdatedPackageJobMailService.name);

  onModuleInit() {
    this.emitter.on('mail', async msg => await this.sendMail(msg));
  }

  async sendMail(repoSubscription: RepoSubscription) {
    await this.mailQueue.add(
        {
          repoUri: repoSubscription.url,
          emails: repoSubscription.emails,
        },
        {
            removeOnFail: false,
            repeat: {
                startDate: new Date(),
                cron: '0 0 * * *', // https://crontab.guru/examples.html
            },
        },
    );
    this.mailQueue.getJobCounts().then((res) => this.logger.debug(res));
  }
}