import * as path from 'path';

import { Module, HttpModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { SendGridModule } from '@ntegral/nestjs-sendgrid';
import { BullModule } from '@nestjs/bull';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { EventEmitter } from 'events';
import { NestEmitterModule } from 'nest-emitter';

import { RepoSubscriptionService } from './services/repo-subscription.service';
import { OutdatedPackageMailService } from './mail/outdated-package-mail.service';
import { RepoSubscriptionsController } from './controllers/repo-subscriptions.controller';
import { SemverService } from './semver/semver.service';
import { OutdatedPackageMailProcessor } from './mail/processors/outdated-package-mail-processor';
import { OutdatedPackageJobMailService } from './mail/jobs/outdated-package-job-mail.service';

@Module({
  imports: [
    HttpModule,
    BullModule.registerQueueAsync({
      name: 'mail',
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('REDIS_HOST'),
          password: configService.get<string>('REDIS_PASSWORD'),
          port: configService.get<number>('REDIS_PORT')
        },
      }),
      inject: [ConfigService],
    }),
    SendGridModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        apiKey: configService.get<string>('SENDGRID_API_KEY'),
      }),
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        transport: {
          service: 'SendGrid',
          auth: {
            user: configService.get<string>('SENDGRID_EMAIL'),
            pass: configService.get<string>('SENDGRID_PASSWORD')
          }
        },
        defaults: {
          from:'"nest-modules" <modules@nestjs.com>',
        },
        template: {
          dir: path.resolve(__dirname, '..', '..', 'templates'),
          adapter: new PugAdapter(),
          options: {
            strict: true,
          },
        },
        options: {
          partials: {
            dir: path.join(process.env.PWD, 'templates/partials'),
            options: {
              strict: true,
            },
          }
        }
      }),
      inject: [ConfigService],
    }),
    NestEmitterModule.forRoot(new EventEmitter()),
  ],
  controllers: [RepoSubscriptionsController],
  providers: [
    OutdatedPackageJobMailService,
    OutdatedPackageMailProcessor,
    OutdatedPackageMailService,
    RepoSubscriptionService, 
    SemverService,
  ],
})
export class RepoSubscriptionModule {}
