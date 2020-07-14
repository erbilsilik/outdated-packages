import { Test } from '@nestjs/testing';
import { RepoSubscriptionsController } from './repo-subscriptions.controller';
import { RepoSubscriptionService } from '../services/repo-subscription.service';
import { RepoSubscriptionDto } from '../dto/repo-subscription.dto';
import { RepoPackage } from '../interfaces/repo-package.interface';

describe('RepoSubscriptionController', () => {
  let repoSubscriptionController: RepoSubscriptionsController;
  let repoSubscriptionService: RepoSubscriptionService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
        controllers: [
          RepoSubscriptionsController,
        ],
        providers: [
          RepoSubscriptionService,
        ],
      }).compile();

    repoSubscriptionController = moduleRef.get<RepoSubscriptionsController>(RepoSubscriptionsController);
    repoSubscriptionService = moduleRef.get<RepoSubscriptionService>(RepoSubscriptionService);
  });

  describe('create', () => {
    it('should create subscription for repository', async () => {
      const outdatedPackages = {
        'package.json': [
          {
            name: '@babel/core',
            currentVersion: '7.4.3',
            latestVersion: '7.10.5',
          },
          {
            name: '@babel/plugin-transform-for-of',
            currentVersion: '7.4.3',
            latestVersion: '7.10.4',
          },
          {
            name: 'core-js-bundle',
            currentVersion: "3.0.0",
            latestVersion: "3.6.5"
          },
        ]
      };

      const outdatedPackagesPromise: Promise<Array<RepoPackage>> = new Promise((resolve) => {
        setTimeout( function() {
          resolve();
          return outdatedPackages
        }, 250) 
      });

      console.log(repoSubscriptionService);

      jest.spyOn(repoSubscriptionService, 'subscribe').mockImplementation(() => outdatedPackagesPromise);

      const repoSubscriptionDto: RepoSubscriptionDto = {
        url: 'https://github.com/jquery/jquery',
        emails: ['abc@xyz.com', 'def@gyz.com']
      };

      expect(await repoSubscriptionController.create(repoSubscriptionDto)).toBe(outdatedPackagesPromise);
    });
  });
});