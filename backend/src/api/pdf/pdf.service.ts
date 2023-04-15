import { BadRequestException, Injectable } from "@nestjs/common";
import { generatePDF } from "@app/pdf/generate";
import { IPDFData } from "@app/pdf/interfaces";
import { PrismaService } from "@app/prisma/prisma.service";
import { GeneratePDFArgs } from "./dto/generate-pdf.args";
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

  async generate(generatePDFInput: GeneratePDFArgs): Promise<PDFEntity[]> {
    // Get operator language
    const operatorLanguage = await this.prisma.language.findFirstOrThrow({
      where: {
        code: OPERATOR_LANGUAGE_CODE,
      },
    });

    // Get gender translations
    const gender = await this.prisma.gender.findFirstOrThrow({
      where: {
        code: generatePDFInput.genderCode,
      },
      include: {
        translations: {
          include: {
            language: true,
          },
        },
      },
    });

    // Get native language translations
    const nativeLanguage = await this.prisma.nativeLanguage.findFirstOrThrow({
      where: {
        code: generatePDFInput.nativeLanguageCode,
      },
      include: {
        translations: {
          include: {
            language: true,
          },
        },
      },
    });

    // Get handedness translations
    const handedness = await this.prisma.handedness.findFirstOrThrow({
      where: {
        code: generatePDFInput.handednessCode,
      },
      include: {
        translations: {
          include: {
            language: true,
          },
        },
      },
    });

    // Set PDF name
    const pdfName = `${generatePDFInput.visitId}_${generatePDFInput.surname}_${generatePDFInput.name}`;

    // Set phantom data
    const phantomData: IPDFData = {
      visitId: generatePDFInput.visitId,
      projectAcronym: generatePDFInput.projectAcronym,
      measurementDate: generatePDFInput.measuredAt,
      finalizerId: generatePDFInput.finalizerId,
      name: generatePDFInput.name,
      surname: generatePDFInput.surname,
      personalId: generatePDFInput.personalId,
      birthdate: generatePDFInput.birthdate,
      gender: gender.translations.find((trans) => trans.language.code === operatorLanguage.code)?.text || "",
      nativeLanguage:
        nativeLanguage.translations.find((trans) => trans.language.code === operatorLanguage.code)?.text || "",
      heightCm: generatePDFInput.heightCm,
      weightKg: generatePDFInput.weightKg,
      visualCorrectionDioptre: generatePDFInput.visualCorrectionDioptre,
      handedness: handedness.translations.find((trans) => trans.language.code === operatorLanguage.code)?.text || "",
      answers: [],
    };

    if (generatePDFInput.isPhantom) {
      // Generate content and return it in a response
      const content = await generatePDF(PDFType.PHANTOM, phantomData, operatorLanguage.code);
      return [createPDF(PDFType.OPERATOR, pdfName, content)];
    }

    // Answers are required for proband/operator PDFs
    if (generatePDFInput.probandLanguageCode === undefined) {
      throw new BadRequestException("Proband language code is required!");
    }

    // Answers are required for proband/operator PDFs
    if (generatePDFInput.answers === undefined) {
      throw new BadRequestException("Answers are required!");
    }

    // Get questions translations
    const questions = (
      await Promise.all(
        generatePDFInput.answers.map((answer) =>
          this.prisma.question.findFirstOrThrow({
            where: {
              id: answer.questionId,
            },
            include: {
              hiddenByGenders: true,
              translations: {
                include: {
                  language: true,
                },
              },
            },
          })
        )
      )
    ).filter((question) => !question.hiddenByGenders.map((hbg) => hbg.genderCode).includes(gender.code));
    const questionsIds = questions.map((question) => question.id);
    const answers = generatePDFInput.answers.filter((answer) => questionsIds.includes(answer.questionId));

    // Set operator data
    const operatorData: IPDFData = {
      ...phantomData,
      email: generatePDFInput.email,
      phone: generatePDFInput.phone,
      answers: answers.map((answer) => ({
        questionText:
          questions
            .find((question) => question.id === answer.questionId)
            ?.translations.find((trans) => trans.language.code === operatorLanguage.code)?.text || "",
        answer: answer.answer,
        comment: answer.comment,
      })),
    };

    // Get proband language
    const probandLanguage
      = generatePDFInput.probandLanguageCode === operatorLanguage.code
        ? operatorLanguage
        : await this.prisma.language.findFirstOrThrow({
            where: {
              code: generatePDFInput.probandLanguageCode,
            },
          });

    // Set proband data
    const probandData: IPDFData
      = probandLanguage.code === operatorLanguage.code
        ? operatorData
        : {
            ...operatorData,
            gender: gender.translations.find((trans) => trans.language.code === probandLanguage.code)?.text || "",
            nativeLanguage:
              nativeLanguage.translations.find((trans) => trans.language.code === probandLanguage.code)?.text || "",
            handedness:
              handedness.translations.find((trans) => trans.language.code === probandLanguage.code)?.text || "",
            answers: answers.map((answer) => ({
              questionText:
                questions
                  .find((question) => question.id === answer.questionId)
                  ?.translations.find((trans) => trans.language.code === probandLanguage.code)?.text || "",
              answer: answer.answer,
              comment: answer.comment,
            })),
          };

    // Generate content and return it in a response
    const [probandContent, operatorContent] = await Promise.all([
      generatePDF(PDFType.PROBAND, probandData, probandLanguage.code),
      generatePDF(PDFType.OPERATOR, operatorData, operatorLanguage.code),
    ]);
    return [createPDF(PDFType.PROBAND, pdfName, probandContent), createPDF(PDFType.OPERATOR, pdfName, operatorContent)];
  }
}
