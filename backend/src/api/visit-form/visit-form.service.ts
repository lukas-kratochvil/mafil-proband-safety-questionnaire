import { BadRequestException, Injectable } from "@nestjs/common";
import { Prisma, VisitFormState } from "@prisma/client";
import { PrismaService } from "@app/prisma/prisma.service";
import { translationsIncludeSchema } from "../utils/utils";
import { CreateVisitFormInput } from "./dto/create-visit-form.input";
import { UpdateVisitFormInput } from "./dto/update-visit-form.input";

const visitFormInclude = Prisma.validator<Prisma.VisitFormInclude>()({
  additionalInfo: true,
  probandLanguage: true,
  answers: true,
  gender: {
    include: translationsIncludeSchema,
  },
  nativeLanguage: {
    include: translationsIncludeSchema,
  },
  handedness: {
    include: translationsIncludeSchema,
  },
});

const visitFormArgs = Prisma.validator<Prisma.VisitFormArgs>()({
  include: visitFormInclude,
});

type VisitFormInclude = Prisma.VisitFormGetPayload<typeof visitFormArgs>;

@Injectable()
export class VisitFormService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createVisitFormInput: CreateVisitFormInput): Promise<VisitFormInclude> {
    return this.prisma.visitForm.create({
      data: {
        state: createVisitFormInput.state ?? VisitFormState.NEW,
        name: createVisitFormInput.name,
        surname: createVisitFormInput.surname,
        personalId: createVisitFormInput.personalId,
        birthdate: createVisitFormInput.birthdate,
        gender: {
          connect: {
            id: createVisitFormInput.genderId,
          },
        },
        nativeLanguage: {
          connect: {
            id: createVisitFormInput.nativeLanguageId,
          },
        },
        heightCm: createVisitFormInput.heightCm,
        weightKg: createVisitFormInput.weightKg,
        handedness: {
          connect: {
            id: createVisitFormInput.handednessId,
          },
        },
        visualCorrectionDioptre: createVisitFormInput.visualCorrectionDioptre,
        email: createVisitFormInput.email,
        phone: createVisitFormInput.phone,
        additionalInfo: createVisitFormInput.additionalInfo
          ? {
              create: {
                ...createVisitFormInput.additionalInfo,
              },
            }
          : undefined,
        probandLanguage: {
          connect: {
            code: createVisitFormInput.probandLanguageCode,
          },
        },
        answers: {
          createMany: {
            data: createVisitFormInput.answers.map((answer) => ({ ...answer })),
          },
        },
      },
      include: visitFormInclude,
    });
  }

  async findAll(state?: VisitFormState): Promise<VisitFormInclude[]> {
    return this.prisma.visitForm.findMany({
      where: {
        state,
        deletedAt: null,
      },
      include: visitFormInclude,
    });
  }

  async findOne(id: string): Promise<VisitFormInclude> {
    return this.prisma.visitForm.findUniqueOrThrow({
      where: {
        id,
      },
      include: visitFormInclude,
    });
  }

  async update(id: string, updateVisitFormInput: UpdateVisitFormInput): Promise<VisitFormInclude | never> {
    return await this.prisma.$transaction(async (tx) => {
      // check if the visit form state wasn't already updated by another user
      if (updateVisitFormInput.state) {
        const visitForm = await tx.visitForm.findFirst({
          where: {
            id,
            state: updateVisitFormInput.state,
          },
        });

        if (visitForm) {
          throw new BadRequestException("Visit form is already in the required state!");
        }
      }

      return tx.visitForm.update({
        where: {
          id,
        },
        data: {
          state: updateVisitFormInput.state,
          name: updateVisitFormInput.name,
          surname: updateVisitFormInput.surname,
          personalId: updateVisitFormInput.personalId,
          birthdate: updateVisitFormInput.birthdate,
          gender: updateVisitFormInput.genderId
            ? {
                connect: {
                  id: updateVisitFormInput.genderId,
                },
              }
            : undefined,
          nativeLanguage: updateVisitFormInput.nativeLanguageId
            ? {
                connect: {
                  id: updateVisitFormInput.nativeLanguageId,
                },
              }
            : undefined,
          heightCm: updateVisitFormInput.heightCm,
          weightKg: updateVisitFormInput.weightKg,
          handedness: updateVisitFormInput.handednessId
            ? {
                connect: {
                  id: updateVisitFormInput.handednessId,
                },
              }
            : undefined,
          visualCorrectionDioptre: updateVisitFormInput.visualCorrectionDioptre,
          email: updateVisitFormInput.email,
          phone: updateVisitFormInput.phone,
          additionalInfo: updateVisitFormInput.additionalInfo
            ? {
                upsert: {
                  create: {
                    // properties are checked against undefined, so the values here are always non-undefined
                    projectId: updateVisitFormInput.additionalInfo.projectId || "",
                    projectAcronym: updateVisitFormInput.additionalInfo.projectAcronym || "",
                    deviceId: updateVisitFormInput.additionalInfo.deviceId || "",
                    deviceName: updateVisitFormInput.additionalInfo.deviceName || "",
                    measuredAt: updateVisitFormInput.additionalInfo.measuredAt || new Date(),
                    finalizedAt: updateVisitFormInput.additionalInfo.finalizedAt || new Date(),
                    finalizer: {
                      connect: {
                        id: updateVisitFormInput.additionalInfo.finalizerId,
                      },
                    },
                  },
                  update: {
                    ...updateVisitFormInput.additionalInfo,
                  },
                },
              }
            : undefined,
          answers: {
            updateMany: updateVisitFormInput.answers
              ? updateVisitFormInput.answers.map((answer) => ({
                  where: {
                    // updates all the related answers having specified question ID
                    questionId: answer.questionId,
                  },
                  data: {
                    answer: answer.answer,
                    comment: answer.comment,
                  },
                }))
              : [],
          },
        },
        include: visitFormInclude,
      });
    });
  }

  async remove(id: string): Promise<VisitFormInclude> {
    return this.prisma.visitForm.update({
      where: {
        id,
      },
      data: {
        state: VisitFormState.DELETED,
        deletedAt: new Date(),
      },
      include: visitFormInclude,
    });
  }
}
