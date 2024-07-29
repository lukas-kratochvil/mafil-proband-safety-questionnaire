import { Test } from "@nestjs/testing";
import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import type { GeneratePDFArgs } from "./dto/generate-pdf.args";
import type { PDFEntity } from "./entities/pdf.entity";
import { PDFResolver } from "./pdf.resolver";
import { PDFService } from "./pdf.service";

describe("PDFResolver", () => {
  let pdfResolver: PDFResolver;
  let pdfService: DeepMockProxy<PDFService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [PDFResolver, PDFService],
    })
      .overrideProvider(PDFService)
      .useValue(mockDeep<PDFService>())
      .compile();

    pdfResolver = module.get<PDFResolver>(PDFResolver);
    pdfService = module.get<PDFService, DeepMockProxy<PDFService>>(PDFService);
  });

  it("generate pdf", () => {
    // ARRANGE
    const args: GeneratePDFArgs = {
      visitId: "VisitId",
      isPhantom: false,
      probandLanguageCode: "en",
      projectAcronym: "ProjAcr",
      measuredAt: new Date(),
      genderCode: "M",
      nativeLanguage: {
        nativeName: "English",
        nameCs: "Angličtina",
      },
      handednessCode: "RH",
      finalizerUsername: "Operator",
      name: "John",
      surname: "Smith",
      personalId: "123456",
      birthdate: new Date(),
      heightCm: 190,
      weightKg: 85,
      visualCorrectionDioptre: -1,
      email: "john.smith@mail.com",
      phone: "123456789",
      answers: [
        {
          questionId: "Q1",
          answer: "NO",
        },
      ],
    };
    const pdf: PDFEntity = {
      name: "",
      content: "",
    };
    pdfService.generate.mockResolvedValueOnce(pdf);

    // ACT
    const generatedPdf = pdfResolver.generatePDF(args);

    // ASSERT
    expect(generatedPdf).resolves.toEqual(pdf);
  });
});
