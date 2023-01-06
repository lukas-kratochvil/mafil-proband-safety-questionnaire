import { Test, TestingModule } from "@nestjs/testing";
import { NativeLanguageTranslationService } from "./native-language-translation.service";

describe("NativeLanguageTranslationService", () => {
  let service: NativeLanguageTranslationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NativeLanguageTranslationService],
    }).compile();

    service = module.get<NativeLanguageTranslationService>(NativeLanguageTranslationService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
