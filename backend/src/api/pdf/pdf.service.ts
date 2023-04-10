import { Injectable } from "@nestjs/common";
import { generatePDF } from "@app/pdf/generate";
import { IPdfData } from "@app/pdf/interfaces";
import { PrismaService } from "@app/prisma/prisma.service";
import { GeneratePDFsArgs } from "./dto/generate-pdf.args";
import { PDFEntity, PDFType } from "./entities/pdf.entity";

const OPERATOR_LANGUAGE_CODE = "cs";

const createPDF = (type: PDFType, name: string, content: string): PDFEntity => {
  const pdf = new PDFEntity();
  pdf.type = type;
  pdf.name = name;
  pdf.extension = "pdf";
  pdf.content = content;
  return pdf;
};

@Injectable()
export class PDFService {
  constructor(private readonly prisma: PrismaService) {}

  async generate(generatePDFsInput: GeneratePDFsArgs): Promise<PDFEntity[]> {
    const genderText = (
      await this.prisma.gender.findFirstOrThrow({
        where: {
          code: generatePDFsInput.genderCode,
        },
        include: {
          translations: {
            where: {
              language: {
                code: OPERATOR_LANGUAGE_CODE,
              },
            },
          },
        },
      })
    ).translations[0].text;
    const nativeLanguageText = (
      await this.prisma.nativeLanguage.findFirstOrThrow({
        where: {
          code: generatePDFsInput.nativeLanguageCode,
        },
        include: {
          translations: {
            where: {
              language: {
                code: OPERATOR_LANGUAGE_CODE,
              },
            },
          },
        },
      })
    ).translations[0].text;
    const handednessText = (
      await this.prisma.handedness.findFirstOrThrow({
        where: {
          code: generatePDFsInput.handednessCode,
        },
        include: {
          translations: {
            where: {
              language: {
                code: OPERATOR_LANGUAGE_CODE,
              },
            },
          },
        },
      })
    ).translations[0].text;

    const data: IPdfData = {
      visitId: generatePDFsInput.visitId,
      projectAcronym: generatePDFsInput.projectAcronym,
      measurementDate: generatePDFsInput.measuredAt,
      finalizerId: generatePDFsInput.finalizerId,
      name: generatePDFsInput.name,
      surname: generatePDFsInput.surname,
      personalId: generatePDFsInput.personalId,
      birthdate: generatePDFsInput.birthdate,
      gender: genderText,
      nativeLanguage: nativeLanguageText,
      heightCm: generatePDFsInput.heightCm,
      weightKg: generatePDFsInput.weightKg,
      visualCorrectionDioptre: generatePDFsInput.visualCorrectionDioptre,
      handedness: handednessText,
      email: generatePDFsInput.email,
      phone: generatePDFsInput.phone,
    };

    const pdfName = `${generatePDFsInput.visitId}_${generatePDFsInput.surname}_${generatePDFsInput.name}`;

    if (generatePDFsInput.isPhantom) {
      const content = await generatePDF(PDFType.PHANTOM, data, OPERATOR_LANGUAGE_CODE);
      return [createPDF(PDFType.OPERATOR, pdfName, content)];
    }

    // check if provided proband language code is valid
    await this.prisma.language.findUniqueOrThrow({
      where: {
        code: generatePDFsInput.probandLanguageCode,
      },
    });

    const [probandContent, operatorContent] = await Promise.all([
      generatePDF(PDFType.PROBAND, data, generatePDFsInput.probandLanguageCode || OPERATOR_LANGUAGE_CODE),
      generatePDF(PDFType.OPERATOR, data, OPERATOR_LANGUAGE_CODE),
    ]);
    return [createPDF(PDFType.PROBAND, pdfName, probandContent), createPDF(PDFType.OPERATOR, pdfName, operatorContent)];
  }
}
