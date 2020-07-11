import { Test, TestingModule } from '@nestjs/testing';
import { RepoSubscriptionsController } from './repo-subscriptions.controller';

describe('RepoSubscriptions Controller', () => {
  let controller: RepoSubscriptionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RepoSubscriptionsController],
    }).compile();

    controller = module.get<RepoSubscriptionsController>(RepoSubscriptionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
