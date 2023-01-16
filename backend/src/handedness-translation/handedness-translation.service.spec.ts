import { Test, TestingModule } from "@nestjs/testing";
import { HandednessTranslationService } from "./handedness-translation.service";

describe("HandednessTranslationService", () => {
  let service: HandednessTranslationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HandednessTranslationService],
    }).compile();

    service = module.get<HandednessTranslationService>(HandednessTranslationService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
