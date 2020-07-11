import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class RepoOutDatedPackagesMailService {
  constructor(private readonly mailerService: MailerService) {}
  
  public send(): void {
    this
      .mailerService
      .sendMail({
        to: 'test@nestjs.com', // list of receivers
        from: 'noreply@nestjs.com', // sender address
        subject: 'Testing Nest MailerModule ✔', // Subject line
        text: 'welcome', // plaintext body
        html: '<b>welcome</b>', // HTML body content
      })
      .then(() => { 
        console.log('Mail delivered successfully');
      })
      .catch((e) => {
        console.log(`Error: ${e} from repo outdated package mail service`);
       });
  }
}