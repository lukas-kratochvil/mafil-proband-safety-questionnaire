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
    const gender = (
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
    const nativeLanguage = (
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
    const handedness = (
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
      gender,
      nativeLanguage,
      heightCm: generatePDFsInput.heightCm,
      weightKg: generatePDFsInput.weightKg,
      visualCorrectionDioptre: generatePDFsInput.visualCorrectionDioptre,
      handedness,
      email: generatePDFsInput.email,
      phone: generatePDFsInput.phone,
    };

    if (generatePDFsInput.isPhantom) {
      const name = `PDF_file_${generatePDFsInput.surname}_${generatePDFsInput.name}`;
      const content = await generatePDF(PDFType.PHANTOM, data, OPERATOR_LANGUAGE_CODE);
      return [createPDF(PDFType.OPERATOR, name, content)];
    }

    // const probandPDF: PDFEntity = {
    //   type: PDFType.PROBAND,
    //   content: generatePDF(PDFType.PROBAND, ...generatePDFsInput, generatePDFsInput.probandLanguageCode),
    // };
    // const operatorPDF: PDFEntity = {
    //   type: PDFType.OPERATOR,
    //   content: generatePDF(PDFType.OPERATOR, ...generatePDFsInput, generatePDFsInput.probandLanguageCode),
    // };
    // return [probandPDF, operatorPDF];
    return [];
  }
}
