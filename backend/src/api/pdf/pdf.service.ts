import fs from "fs";
import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AnswerOption, Prisma } from "@prisma/client";
import { EnvironmentVariables } from "@app/config.interface";
import { generateBase64PDF } from "@app/pdf/generate";
import { IPDFData, IPDFEntityTexts, IPDFOperator, IPDFQuestionAnswer } from "@app/pdf/interfaces";
import { PrismaService } from "@app/prisma/prisma.service";
import { GENERATED_PDF_DIR_PATH } from "@app/utils/paths";
import { GeneratePDFArgs } from "./dto/generate-pdf.args";
import { PDFEntity } from "./entities/pdf.entity";

type GenerateProbandPDFArgs = Required<Omit<GeneratePDFArgs, "approverUsername">> &
  Pick<GeneratePDFArgs, "approverUsername">;

type EntityTranslations = {
  text: string;
}[];

@Injectable()
export class PDFService {
  // Default language for all the operator text translations
  private operatorLanguageCode: string;
  // TODO: delete - only for a development purpose
  private isDevelopment: boolean;

  constructor(config: ConfigService<EnvironmentVariables, true>, private readonly prisma: PrismaService) {
    this.operatorLanguageCode = config.get("PDF_OPERATOR_LANGUAGE_CODE", { infer: true });
    this.isDevelopment = config.get("NODE_ENV", { infer: true }) === "development";
  }

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
              code: this.operatorLanguageCode,
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
              code: this.operatorLanguageCode,
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
              code: this.operatorLanguageCode,
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
    let languageCodeOrder: Prisma.SortOrder = "asc";

    if (useSecondaryLanguage) {
      languageCodes.push(this.operatorLanguageCode);

      // Ensure that proband translations are always at index 0
      if (generatePDFInput.probandLanguageCode > this.operatorLanguageCode) {
        languageCodeOrder = "desc";
      }
    }

    const languageOrderBy = Prisma.validator<Prisma.LanguageOrderByWithAggregationInput>()({ code: languageCodeOrder });
    const getTranslatedTexts = (translations: EntityTranslations): IPDFEntityTexts => ({
      text: translations[0].text,
      secondaryText: languageCodes.length === 1 ? undefined : translations[1].text,
    });

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
      .map((question, i) => ({
        ...getTranslatedTexts(question.translations),
        answer: generatePDFInput.answers?.at(i)?.answer as AnswerOption,
        comment: generatePDFInput.answers?.at(i)?.comment,
        hiddenByGenders: question.hiddenByGenders,
      }))
      // We need to firstly assign all the values and then filter the questions, otherwise the values will be incorrectly assigned to different questions
      .filter((question) => !question.hiddenByGenders.map((hbg) => hbg.genderCode).includes(gender.code))
      .map((question) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { hiddenByGenders, ...rest } = question;
        return rest;
      });

    // Get operator who approved the visit
    let operatorApprover: IPDFOperator | undefined;

    if (generatePDFInput.approverUsername) {
      operatorApprover = await this.prisma.operator.findUniqueOrThrow({
        where: {
          username: generatePDFInput.approverUsername,
        },
        select: {
          name: true,
          surname: true,
        },
      });
    }

    return {
      isPhantom: false,
      visitId: generatePDFInput.visitId,
      projectAcronym: generatePDFInput.projectAcronym,
      measurementDate: generatePDFInput.measuredAt,
      operatorFinalizer,
      operatorApprover,
      name: generatePDFInput.name,
      surname: generatePDFInput.surname,
      personalId: generatePDFInput.personalId,
      birthdate: generatePDFInput.birthdate,
      gender: getTranslatedTexts(gender.translations),
      nativeLanguage: getTranslatedTexts(nativeLanguage.translations),
      heightCm: generatePDFInput.heightCm,
      weightKg: generatePDFInput.weightKg,
      visualCorrectionDioptre: generatePDFInput.visualCorrectionDioptre,
      handedness: getTranslatedTexts(handedness.translations),
      email: generatePDFInput.email,
      phone: generatePDFInput.phone,
      answers,
    };
  }

  private createPDF(name: string, base64Content: string): PDFEntity {
    // TODO: delete - only for a development purpose to store generated PDF locally
    if (this.isDevelopment) {
      const fileName = `${GENERATED_PDF_DIR_PATH}/visit_${Date.now()}.pdf`;
      fs.writeFile(fileName, Buffer.from(base64Content, "base64"), (err) =>
        console.log(err ? err : `Development PDF '${fileName}' successfully created!`)
      );
    }

    const pdf = new PDFEntity();
    pdf.name = name;
    pdf.extension = "pdf";
    pdf.base64Content = base64Content;
    return pdf;
  }

  async generate(generatePDFInput: GeneratePDFArgs): Promise<PDFEntity> {
    // Set PDF name
    const pdfName = this.createPDFName(generatePDFInput);

    // Get operator who finalized the visit
    const operatorFinalizer: IPDFOperator = await this.prisma.operator.findUniqueOrThrow({
      where: {
        username: generatePDFInput.finalizerUsername,
      },
      select: {
        name: true,
        surname: true,
      },
    });

    if (generatePDFInput.isPhantom) {
      // Prepare data for PDF generation
      const phantomData = await this.getPhantomPDFData(generatePDFInput, operatorFinalizer);
      // Generate PDF
      const base64Content = await generateBase64PDF(phantomData, this.operatorLanguageCode);
      return this.createPDF(pdfName, base64Content);
    }

    // Proband language code is required for proband PDF
    if (generatePDFInput.probandLanguageCode === undefined) {
      throw new BadRequestException("Proband language code is required!");
    }

    // Answers are required for proband PDF
    if (generatePDFInput.answers === undefined || generatePDFInput.answers.length === 0) {
      throw new BadRequestException("Answers are required!");
    }

    const useSecondaryLanguage = generatePDFInput.probandLanguageCode !== this.operatorLanguageCode;
    // Prepare data for PDF generation
    const data = await this.getProbandPDFData(
      {
        ...generatePDFInput,
        probandLanguageCode: generatePDFInput.probandLanguageCode,
        answers: generatePDFInput.answers,
      },
      operatorFinalizer,
      useSecondaryLanguage
    );
    const secondaryLocale = useSecondaryLanguage ? this.operatorLanguageCode : undefined;

    // Generate PDF
    const base64Content = await generateBase64PDF(data, generatePDFInput.probandLanguageCode, secondaryLocale);
    return this.createPDF(pdfName, base64Content);
  }
}
