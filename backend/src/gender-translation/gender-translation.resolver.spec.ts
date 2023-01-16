import { Test, TestingModule } from "@nestjs/testing";
import { GenderTranslationResolver } from "./gender-translation.resolver";
import { GenderTranslationService } from "./gender-translation.service";

describe("GenderTranslationResolver", () => {
  let resolver: GenderTranslationResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GenderTranslationResolver, GenderTranslationService],
    }).compile();

    resolver = module.get<GenderTranslationResolver>(GenderTranslationResolver);
  });

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });
});
