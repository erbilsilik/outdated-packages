import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { RepoSubscriptionDto } from '../src/repo-subscription/dto/repo-subscription.dto';
import { RepoSubscriptionService } from '../src/repo-subscription/services/repo-subscription.service';

describe('Outdated Packages', () => {
  let app: INestApplication;
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
  }
  const repoSubscriptionService = { 
    subscribe: () => outdatedPackages,
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
    })
      .overrideProvider(RepoSubscriptionService)
      .useValue(repoSubscriptionService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/POST repo-subscriptions`, () => {
    const validRepoSubscriptionDto: RepoSubscriptionDto = {
      url: 'https://github.com/jquery/jquery', 
      emails: [
        "abc.xyz@def.com", 
        "def@zz.com",
      ],
    };
    return request(app.getHttpServer())
      .post('api/v1/repo-subscriptions')
      .send(validRepoSubscriptionDto)
      .expect(200)
      .expect({
        data: repoSubscriptionService.subscribe(),
      });
  });

  afterAll(async () => {
    await app.close();
  });
});