import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class RepoOutDatedPackagesMailService {
  constructor(private readonly mailerService: MailerService) {}
  
  public send(to: Array<string>, { packageInfo: { repoUri }, packageFiles }): void {
    this
      .mailerService
      .sendMail({
        to,
        from: 'outdated-packages@mail.com',
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