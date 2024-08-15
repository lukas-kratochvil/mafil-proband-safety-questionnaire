import { BadRequestException } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { Test } from "@nestjs/testing";
import { PrismaClient, type Operator } from "@prisma/client";
import { DeepMockProxy, mockDeep } from "vitest-mock-extended";
import { PrismaService } from "@app/prisma/prisma.service";
import type { GeneratePDFArgs } from "./dto/generate-pdf.args";
import { PDFEntity } from "./entities/pdf.entity";
import { PDFService } from "./pdf.service";

//----------------------------------------------------------------------
// Test data
//----------------------------------------------------------------------
const operatorFinalizer: Operator = {
  id: "1",
  name: "OperatorName",
  surname: "username",
  username: "OperatorUsername",
  email: "name.surname@mail.com",
  role: "MR_HIGH_PERM",
  lastLoggedAt: new Date(),
  isValid: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

const configOperatorLanguageCode = "en";
const questionId = "1";

const generatePDFInputProbandEverythingFilled: GeneratePDFArgs = {
  visitId: "VisitId",
  isPhantom: false,
  probandLanguageCode: configOperatorLanguageCode,
  projectAcronym: "ProjAcr",
  measuredAt: new Date(),
  genderCode: "M",
  nativeLanguage: {
    nativeName: "English",
    nameCs: "Angličtina",
  },
  handednessCode: "RH",
  finalizerUsername: operatorFinalizer.username,
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
      questionId,
      answer: "NO",
    },
  ],
};

//----------------------------------------------------------------------
// Mocking PDF generation
//----------------------------------------------------------------------
const pdfContent = "base64PDF";
vi.mock("@app/pdf/generate", () => ({
  generateBase64PDF: () => pdfContent,
}));

//----------------------------------------------------------------------
// Tests
//----------------------------------------------------------------------
describe("PDFService", () => {
  let pdfService: PDFService;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forFeature(async () => ({
          pdfOperatorLanguageCode: configOperatorLanguageCode,
          nodeEnv: "production",
        })),
      ],
      providers: [PDFService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    pdfService = module.get<PDFService>(PDFService);
    prisma = module.get<PrismaService, DeepMockProxy<PrismaClient>>(PrismaService);
  });

  it("generate phantom PDF", () => {
    // ARRANGE
    const generatePDFInput: GeneratePDFArgs = {
      ...generatePDFInputProbandEverythingFilled,
      isPhantom: true,
      genderCode: "O",
      handednessCode: "UN",
      name: "phantom",
      surname: "phantom",
      email: "",
      phone: "",
    };
    prisma.operator.findUniqueOrThrow.mockResolvedValueOnce(operatorFinalizer);
    prisma.gender.findFirstOrThrow.mockResolvedValueOnce({
      id: "1",
      code: "O",
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      translations: vi.fn().mockResolvedValueOnce([{ code: "en", text: "Other" }]),
    });
    prisma.handedness.findFirstOrThrow.mockResolvedValueOnce({
      id: "1",
      code: "UN",
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      translations: vi.fn().mockResolvedValueOnce([{ code: "en", text: "Undetermined" }]),
    });

    // ACT
    const pdf = pdfService.generate(generatePDFInput);

    // ASSERT
    const expectedPdf: PDFEntity = new PDFEntity();
    expectedPdf.name = `${generatePDFInput.visitId}_${generatePDFInput.surname}_${generatePDFInput.name}.pdf`;
    expectedPdf.content = pdfContent;
    expect(pdf).resolves.toStrictEqual(expectedPdf);
  });

  it("generate proband PDF - no proband language code", () => {
    // ARRANGE
    const generatePDFInput: GeneratePDFArgs = {
      ...generatePDFInputProbandEverythingFilled,
      probandLanguageCode: undefined,
    };
    prisma.operator.findUniqueOrThrow.mockResolvedValueOnce(operatorFinalizer);

    // ACT
    const pdf = pdfService.generate(generatePDFInput);

    // ASSERT
    expect(pdf).rejects.toThrow(BadRequestException);
  });

  it("generate proband PDF - no answers", () => {
    // ARRANGE
    const generatePDFInput: GeneratePDFArgs = {
      ...generatePDFInputProbandEverythingFilled,
      answers: undefined,
    };
    prisma.operator.findUniqueOrThrow.mockResolvedValueOnce(operatorFinalizer);

    // ACT
    const pdf = pdfService.generate(generatePDFInput);

    // ASSERT
    expect(pdf).rejects.toThrow(BadRequestException);
  });

  it("generate proband PDF", () => {
    // ARRANGE
    const generatePDFInput: GeneratePDFArgs = generatePDFInputProbandEverythingFilled;
    prisma.operator.findUniqueOrThrow.mockResolvedValueOnce(operatorFinalizer);
    prisma.gender.findFirstOrThrow.mockResolvedValueOnce({
      id: "1",
      code: "M",
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      translations: vi.fn().mockResolvedValueOnce([{ code: "en", text: "Male" }]),
    });
    prisma.handedness.findFirstOrThrow.mockResolvedValueOnce({
      id: "1",
      code: "RH",
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      translations: vi.fn().mockResolvedValueOnce([{ code: "en", text: "Right-handed" }]),
    });
    prisma.question.findFirstOrThrow.mockResolvedValueOnce({
      id: questionId,
      order: 1,
      partNumber: 1,
      mustBeApproved: false,
      previousQuestionId: null,
      isValid: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      hiddenByGenders: [] as any,
      translations: vi.fn().mockResolvedValueOnce([{ code: "en", text: "Question 1" }]),
    });

    // ACT
    const pdf = pdfService.generate(generatePDFInput);

    // ASSERT
    const expectedPdf: PDFEntity = new PDFEntity();
    expectedPdf.name = `${generatePDFInput.visitId}_${generatePDFInput.surname}_${generatePDFInput.name}.pdf`;
    expectedPdf.content = pdfContent;
    expect(pdf).resolves.toStrictEqual(expectedPdf);
  });
});
