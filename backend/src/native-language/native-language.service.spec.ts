import { Test, TestingModule } from "@nestjs/testing";
import { NativeLanguageService } from "./native-language.service";

describe("NativeLanguageService", () => {
  let service: NativeLanguageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NativeLanguageService],
    }).compile();

    service = module.get<NativeLanguageService>(NativeLanguageService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
