import { Test } from "@nestjs/testing";
import { PrismaClient } from "@prisma/client";
import { DeepMockProxy, mockDeep } from "vitest-mock-extended";
import { PrismaService } from "@app/prisma/prisma.service";
import { HTMLCardService } from "./html-card.service";

// TODO: how should be tests for HTMLService created?
describe("HTMLCardService", () => {
  let htmlCardService: HTMLCardService;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [HTMLCardService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    htmlCardService = module.get<HTMLCardService>(HTMLCardService);
    prisma = module.get<PrismaService, DeepMockProxy<PrismaClient>>(PrismaService);
  });

  it("should be defined", () => {
    expect(htmlCardService).toBeDefined();
    expect(prisma).toBeDefined();
  });
});
