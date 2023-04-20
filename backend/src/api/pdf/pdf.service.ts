import { BadRequestException, Injectable } from "@nestjs/common";
import { AnswerOption, Prisma } from "@prisma/client";
import { generatePDF, PDF_OPERATOR_LANGUAGE_CODE } from "@app/pdf/generate";
import { IPDFData, IPDFOperator, IPDFQuestionAnswer } from "@app/pdf/interfaces";
import { PrismaService } from "@app/prisma/prisma.service";
import { GeneratePDFArgs } from "./dto/generate-pdf.args";
import { PDFEntity } from "./entities/pdf.entity";

type GenerateProbandPDFArgs = Required<Omit<GeneratePDFArgs, "approverUco">> & Pick<GeneratePDFArgs, "approverUco">;

@Injectable()
export class PDFService {
  constructor(private readonly prisma: PrismaService) {}

  private createPDFName(generatePDFInput: GeneratePDFArgs): string {
    return `${generatePDFInput.visitId}_${generatePDFInput.surname}_${generatePDFInput.name}`;
  }

  private async getPhantomPDFData(
    generatePDFInput: GeneratePDFArgs,
    operatorFinalizer: IPDFOperator
  ): Promise<IPDFData> {
    // Get gender translations
    const gender = await this.prisma.gender.findFirstOrThrow({
      where: {
        code: generatePDFInput.genderCode,
      },
      select: {
        translations: {
          where: {
            language: {
              code: PDF_OPERATOR_LANGUAGE_CODE,
            },
          },
          select: {
            text: true,
          },
        },
      },
    });

    // Get native language translations
    const nativeLanguage = await this.prisma.nativeLanguage.findFirstOrThrow({
      where: {
        code: generatePDFInput.nativeLanguageCode,
      },
      select: {
        translations: {
          where: {
            language: {
              code: PDF_OPERATOR_LANGUAGE_CODE,
            },
          },
          select: {
            text: true,
          },
        },
      },
    });

    // Get handedness translations
    const handedness = await this.prisma.handedness.findFirstOrThrow({
      where: {
        code: generatePDFInput.handednessCode,
      },
      select: {
        translations: {
          where: {
            language: {
              code: PDF_OPERATOR_LANGUAGE_CODE,
            },
          },
          select: {
            text: true,
          },
        },
      },
    });

    return {
      isPhantom: true,
      useSecondaryLanguage: false,
      visitId: generatePDFInput.visitId,
      projectAcronym: generatePDFInput.projectAcronym,
      measurementDate: generatePDFInput.measuredAt,
      operatorFinalizer,
      name: generatePDFInput.name,
      surname: generatePDFInput.surname,
      personalId: generatePDFInput.personalId,
      birthdate: generatePDFInput.birthdate,
      gender: { text: gender.translations[0].text },
      nativeLanguage: { text: nativeLanguage.translations[0].text },
      heightCm: generatePDFInput.heightCm,
      weightKg: generatePDFInput.weightKg,
      visualCorrectionDioptre: generatePDFInput.visualCorrectionDioptre,
      handedness: { text: handedness.translations[0].text },
      answers: [],
    };
  }

  private async getProbandPDFData(
    generatePDFInput: GenerateProbandPDFArgs,
    operatorFinalizer: IPDFOperator,
    useSecondaryLanguage: boolean
  ): Promise<IPDFData> {
    const languageCodes = [generatePDFInput.probandLanguageCode];

    if (useSecondaryLanguage) {
      languageCodes.push(PDF_OPERATOR_LANGUAGE_CODE);
    }

    const languageOrderBy = Prisma.validator<Prisma.LanguageOrderByWithAggregationInput>()({ code: "asc" });
    const translationTextIndex
      = !useSecondaryLanguage || generatePDFInput.probandLanguageCode < PDF_OPERATOR_LANGUAGE_CODE ? 0 : 1;
    const translationSecondaryTextIndex = !useSecondaryLanguage ? undefined : translationTextIndex === 0 ? 1 : 0;

    // Get gender translations
    const gender = await this.prisma.gender.findFirstOrThrow({
      where: {
        code: generatePDFInput.genderCode,
      },
      select: {
        code: true,
        translations: {
          where: {
            language: {
              code: {
                in: languageCodes,
              },
            },
          },
          select: {
            text: true,
          },
          orderBy: {
            language: languageOrderBy,
          },
        },
      },
    });

    // Get native language translations
    const nativeLanguage = await this.prisma.nativeLanguage.findFirstOrThrow({
      where: {
        code: generatePDFInput.nativeLanguageCode,
      },
      select: {
        translations: {
          where: {
            language: {
              code: {
                in: languageCodes,
              },
            },
          },
          select: {
            text: true,
          },
          orderBy: {
            language: languageOrderBy,
          },
        },
      },
    });

    // Get handedness translations
    const handedness = await this.prisma.handedness.findFirstOrThrow({
      where: {
        code: generatePDFInput.handednessCode,
      },
      select: {
        translations: {
          where: {
            language: {
              code: {
                in: languageCodes,
              },
            },
          },
          select: {
            text: true,
          },
          orderBy: {
            language: languageOrderBy,
          },
        },
      },
    });

    // Get answers with questions texts
    const answers: IPDFQuestionAnswer[] = (
      await Promise.all(
        generatePDFInput.answers.map((answer) =>
          this.prisma.question.findFirstOrThrow({
            where: {
              id: answer.questionId,
            },
            select: {
              hiddenByGenders: true,
              translations: {
                where: {
                  language: {
                    code: {
                      in: languageCodes,
                    },
                  },
                },
                select: {
                  text: true,
                  language: {
                    select: {
                      code: true,
                    },
                  },
                },
                orderBy: {
                  language: languageOrderBy,
                },
              },
            },
          })
        )
      )
    )
      .filter((question) => !question.hiddenByGenders.map((hbg) => hbg.genderCode).includes(gender.code))
      .map((question, i) => ({
        questionText: question.translations[translationTextIndex].text,
        questionSecondaryText: translationSecondaryTextIndex
          ? question.translations[translationSecondaryTextIndex].text
          : undefined,
        answer: generatePDFInput.answers?.at(i)?.answer as AnswerOption,
        comment: generatePDFInput.answers?.at(i)?.comment,
      }));

    // Get operator who approved the visit
    let operatorApprover: IPDFOperator | undefined;

    if (generatePDFInput.approverUco) {
      operatorApprover = await this.prisma.operator.findUniqueOrThrow({
        where: {
          uco: generatePDFInput.approverUco,
        },
        select: {
          name: true,
          surname: true,
        },
      });
    }

    return {
      isPhantom: false,
      useSecondaryLanguage,
      visitId: generatePDFInput.visitId,
      projectAcronym: generatePDFInput.projectAcronym,
      measurementDate: generatePDFInput.measuredAt,
      operatorFinalizer,
      operatorApprover,
      name: generatePDFInput.name,
      surname: generatePDFInput.surname,
      personalId: generatePDFInput.personalId,
      birthdate: generatePDFInput.birthdate,
      gender: {
        text: gender.translations[translationTextIndex].text,
        secondaryText: translationSecondaryTextIndex
          ? gender.translations[translationSecondaryTextIndex].text
          : undefined,
      },
      nativeLanguage: {
        text: nativeLanguage.translations[translationTextIndex].text,
        secondaryText: translationSecondaryTextIndex
          ? nativeLanguage.translations[translationSecondaryTextIndex].text
          : undefined,
      },
      heightCm: generatePDFInput.heightCm,
      weightKg: generatePDFInput.weightKg,
      visualCorrectionDioptre: generatePDFInput.visualCorrectionDioptre,
      handedness: {
        text: handedness.translations[translationTextIndex].text,
        secondaryText: translationSecondaryTextIndex
          ? handedness.translations[translationSecondaryTextIndex].text
          : undefined,
      },
      email: generatePDFInput.email,
      phone: generatePDFInput.phone,
      answers,
    };
  }

  private createPDF(name: string, content: string): PDFEntity {
    const pdf = new PDFEntity();
    pdf.name = name;
    pdf.extension = "pdf";
    pdf.content = content;
    return pdf;
  }

  async generate(generatePDFInput: GeneratePDFArgs): Promise<PDFEntity> {
    // Set PDF name
    const pdfName = this.createPDFName(generatePDFInput);

    // Get operator who finalized the visit
    const operatorFinalizer: IPDFOperator = await this.prisma.operator.findUniqueOrThrow({
      where: {
        uco: generatePDFInput.finalizerUco,
      },
      select: {
        name: true,
        surname: true,
      },
    });

    if (generatePDFInput.isPhantom) {
      const phantomData = await this.getPhantomPDFData(generatePDFInput, operatorFinalizer);

      // Generate content and return it in the response
      const content = await generatePDF(phantomData, PDF_OPERATOR_LANGUAGE_CODE);
      return this.createPDF(pdfName, content);
    }

    // Proband language code is required for proband PDF
    if (generatePDFInput.probandLanguageCode === undefined) {
      throw new BadRequestException("Proband language code is required!");
    }

    // Answers are required for proband PDF
    if (generatePDFInput.answers === undefined || generatePDFInput.answers.length === 0) {
      throw new BadRequestException("Answers are required!");
    }

    const useSecondaryLanguage = generatePDFInput.probandLanguageCode !== PDF_OPERATOR_LANGUAGE_CODE;
    const data = await this.getProbandPDFData(
      {
        ...generatePDFInput,
        probandLanguageCode: generatePDFInput.probandLanguageCode,
        answers: generatePDFInput.answers,
      },
      operatorFinalizer,
      useSecondaryLanguage
    );

    // Generate content and return it in the response
    const content = await generatePDF(
      data,
      generatePDFInput.probandLanguageCode,
      useSecondaryLanguage ? PDF_OPERATOR_LANGUAGE_CODE : undefined
    );
    return this.createPDF(pdfName, content);
  }
}
