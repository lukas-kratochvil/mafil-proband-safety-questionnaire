import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { PrismaClient } from "@prisma/client";
import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import { EnvironmentVariables } from "@app/config.interface";
import { PrismaService } from "@app/prisma/prisma.service";
import { PDFResolver } from "./pdf.resolver";
import { PDFService } from "./pdf.service";

describe("PDFResolver", () => {
  let pdfResolver: PDFResolver;
  let config: ConfigService<EnvironmentVariables, true>;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PDFResolver, PDFService, ConfigService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    pdfResolver = module.get<PDFResolver>(PDFResolver);
    config = module.get<ConfigService<EnvironmentVariables, true>>(ConfigService);
    prisma = module.get<PrismaService, DeepMockProxy<PrismaClient>>(PrismaService);
  });

  it("should be defined", () => {
    expect(pdfResolver).toBeDefined();
  });
});
