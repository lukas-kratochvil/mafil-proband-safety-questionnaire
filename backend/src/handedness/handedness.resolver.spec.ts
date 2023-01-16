import { Test, TestingModule } from "@nestjs/testing";
import { HandednessResolver } from "./handedness.resolver";
import { HandednessService } from "./handedness.service";

describe("HandednessResolver", () => {
  let resolver: HandednessResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HandednessResolver, HandednessService],
    }).compile();

    resolver = module.get<HandednessResolver>(HandednessResolver);
  });

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });
});
