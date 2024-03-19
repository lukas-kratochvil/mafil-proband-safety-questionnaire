import { Test, TestingModule } from "@nestjs/testing";
import { NativeLanguageResolver } from "./native-language.resolver";
import { NativeLanguageService } from "./native-language.service";

describe("NativeLanguageResolver", () => {
  let nativeLanguageResolver: NativeLanguageResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NativeLanguageResolver, NativeLanguageService],
    }).compile();

    nativeLanguageResolver = module.get<NativeLanguageResolver>(NativeLanguageResolver);
  });

  it("should be defined", () => {
    expect(nativeLanguageResolver).toBeDefined();
  });
});
