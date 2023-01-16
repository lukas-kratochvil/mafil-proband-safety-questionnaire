import { Test, TestingModule } from "@nestjs/testing";
import { HandednessTranslationResolver } from "./handedness-translation.resolver";
import { HandednessTranslationService } from "./handedness-translation.service";

describe("HandednessTranslationResolver", () => {
  let resolver: HandednessTranslationResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HandednessTranslationResolver, HandednessTranslationService],
    }).compile();

    resolver = module.get<HandednessTranslationResolver>(HandednessTranslationResolver);
  });

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });
});
