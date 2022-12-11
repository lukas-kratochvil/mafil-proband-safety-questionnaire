import { Test, TestingModule } from "@nestjs/testing";
import { OperatorResolver } from "./operator.resolver";
import { OperatorService } from "./operator.service";

describe("OperatorResolver", () => {
  let resolver: OperatorResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OperatorResolver, OperatorService],
    }).compile();

    resolver = module.get<OperatorResolver>(OperatorResolver);
  });

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });
});
