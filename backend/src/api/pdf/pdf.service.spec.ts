import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { PrismaClient } from "@prisma/client";
import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import { EnvironmentVariables } from "@app/config.interface";
import { PrismaService } from "@app/prisma/prisma.service";
import { PDFService } from "./pdf.service";

describe("PDFService", () => {
  let pdfService: PDFService;
  let config: ConfigService<EnvironmentVariables, true>;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PDFService, ConfigService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    pdfService = module.get<PDFService>(PDFService);
    config = module.get<ConfigService<EnvironmentVariables, true>>(ConfigService);
    prisma = module.get<PrismaService, DeepMockProxy<PrismaClient>>(PrismaService);
  });

  it("should be defined", () => {
    expect(pdfService).toBeDefined();
  });
});
