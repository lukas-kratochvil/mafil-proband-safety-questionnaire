import { Test, TestingModule } from "@nestjs/testing";
import { NativeLanguageTranslationResolver } from "./native-language-translation.resolver";
import { NativeLanguageTranslationService } from "./native-language-translation.service";

describe("NativeLanguageTranslationResolver", () => {
  let resolver: NativeLanguageTranslationResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NativeLanguageTranslationResolver, NativeLanguageTranslationService],
    }).compile();

    resolver = module.get<NativeLanguageTranslationResolver>(NativeLanguageTranslationResolver);
  });

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });
});
