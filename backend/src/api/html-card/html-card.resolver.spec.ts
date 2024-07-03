import { Test } from "@nestjs/testing";
import { PrismaClient } from "@prisma/client";
import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import { PrismaService } from "@app/prisma/prisma.service";
import { HTMLCardResolver } from "./html-card.resolver";
import { HTMLCardService } from "./html-card.service";

describe("HTMLCardResolver", () => {
  let htmlCardResolver: HTMLCardResolver;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [HTMLCardResolver, HTMLCardService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    htmlCardResolver = module.get<HTMLCardResolver>(HTMLCardResolver);
    prisma = module.get<PrismaService, DeepMockProxy<PrismaClient>>(PrismaService);
  });

  it("should be defined", () => {
    expect(htmlCardResolver).toBeDefined();
  });
});
