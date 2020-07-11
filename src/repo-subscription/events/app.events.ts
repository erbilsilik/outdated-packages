import { EventEmitter } from 'events';
import { StrictEventEmitter } from 'nest-emitter';
import { RepoSubscriptionDto } from '../dto/repo-subscription.dto';

interface AppEvents {
  mail: RepoSubscriptionDto;
  newRequest: (req: Express.Request) => void;
}

export type MailEventEmitter = StrictEventEmitter<EventEmitter, AppEvents>;
