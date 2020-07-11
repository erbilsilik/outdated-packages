import * as path from 'path';

import { Module, HttpModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { BullModule } from '@nestjs/bull';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { EventEmitter } from 'events';
import { NestEmitterModule } from 'nest-emitter';

import { RepoSubscriptionsController } from './controllers/repo-subscriptions.controller';
// import { repoSubscriptionProviders } from './providers/repo-subscription.providers';
import { RepoSubscriptionService } from './services/repo-subscription.service';
import { MailProcessor } from './processors/mail-processor';
import { RepoOutDatedPackagesMailService } from './services/mail/repo-outdated-packages';
import { MailSenderService } from './services/mail/sender/mail-sender';

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
    MailerModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('MAIL_HOST'),
          port: configService.get<number>('MAIL_PORT'),
          auth: {
            user: configService.get<number>('MAIL_USER'),
            pass: configService.get<number>('MAIL_PASS')
        },
        },
        defaults: {
          from:'"nest-modules" <modules@nestjs.com>',
        },
        template: {
          dir: __dirname + '/templates',
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
    MailProcessor,
    MailSenderService,
    RepoOutDatedPackagesMailService,
    RepoSubscriptionService, 
    // ...repoSubscriptionProviders,
  ],
})
export class RepoSubscriptionModule {}
