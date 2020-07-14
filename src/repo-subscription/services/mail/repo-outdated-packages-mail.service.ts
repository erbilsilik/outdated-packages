import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RepoOutDatedPackagesMailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    ) {}
  
  public send(to: Array<string>, { packageInfo: { repoUri }, packageFiles }): void {
    this
      .mailerService
      .sendMail({
        to,
        from: this.configService.get<string>('SENDGRID_EMAIL'),
        subject: `${new Date().toDateString()} - ${repoUri} outdated packages`,
        template: 'outdated-packages',
        context: {
          packageFiles
        },
      })
      .then(() => { 
        console.log('Mail delivered successfully');
      })
      .catch((e) => {
        console.log(`Error: ${e} from repo outdated package mail service`);
       });
  }
}