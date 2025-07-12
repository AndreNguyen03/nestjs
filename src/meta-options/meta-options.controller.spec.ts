import { Test, TestingModule } from '@nestjs/testing';
import { MetaOptionsController } from './meta-options.controller';

describe('MetaOptionsController', () => {
  let controller: MetaOptionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MetaOptionsController],
    }).compile();

    controller = module.get<MetaOptionsController>(MetaOptionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
