import * as path from 'path';

import { Module } from '@nestjs/common';
import { RepoSubscriptionModule } from './repo-subscription/repo-subscription.module';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development.local', '.env.development'],
      isGlobal: true,
    }),
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: "smtp.mailtrap.io",
          port: 2525,
          auth: {
            user: "615e3b76e68468",
            pass: "7da22e96055502"
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
    }),
    RepoSubscriptionModule
  ],
  providers: [],
})
export class AppModule {}
