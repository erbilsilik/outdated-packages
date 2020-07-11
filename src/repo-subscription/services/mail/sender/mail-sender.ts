import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectEventEmitter } from 'nest-emitter';
import { MailEventEmitter } from 'src/repo-subscription/events/app.events';
import { RepoSubscriptionDto } from 'src/repo-subscription/dto/repo-subscription.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class MailSenderService implements OnModuleInit {
  constructor(
      @InjectEventEmitter() private readonly emitter: MailEventEmitter,
      @InjectQueue('mail') private mailQueue: Queue,
  ) {}
  private readonly logger = new Logger(MailSenderService.name);

  onModuleInit() {
    this.emitter.on('mail', async msg => await this.sendMail(msg));
  }

  async sendMail(repoSubscriptionDto: RepoSubscriptionDto) {
    await this.mailQueue.add(
        {
          repoUri: repoSubscriptionDto.url,
          emails: repoSubscriptionDto.emails,
        },
        {
            removeOnFail: false,
            // repeat: {
            //     startDate: new Date(),
            //     cron: '* * * * *', // every minute
            // },
        },
    );
    this.mailQueue.getJobCounts().then((res) => this.logger.debug(res));
  }
}