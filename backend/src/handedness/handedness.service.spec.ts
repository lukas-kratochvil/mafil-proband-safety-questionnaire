import { Test, TestingModule } from "@nestjs/testing";
import { HandednessService } from "./handedness.service";

describe("HandednessService", () => {
  let service: HandednessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HandednessService],
    }).compile();

    service = module.get<HandednessService>(HandednessService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
