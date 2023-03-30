import { Injectable } from "@nestjs/common";
import { Prisma, VisitFormState } from "@prisma/client";
import { PrismaService } from "@app/prisma/prisma.service";
import { CreateVisitFormInput } from "./dto/create-visit-form.input";
import { UpdateVisitFormInput } from "./dto/update-visit-form.input";
import { translationsIncludeSchema } from "../utils/utils";

const visitFormInclude = Prisma.validator<Prisma.VisitFormInclude>()({
  additionalInfo: true,
  probandInfo: {
    include: {
      gender: {
        include: translationsIncludeSchema,
      },
      nativeLanguage: {
        include: translationsIncludeSchema,
      },
      handedness: {
        include: translationsIncludeSchema,
      },
    },
  },
  answers: true,
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
        probandInfo: {
          create: {
            name: createVisitFormInput.probandInfo.name,
            surname: createVisitFormInput.probandInfo.surname,
            personalId: createVisitFormInput.probandInfo.personalId,
            birthdate: createVisitFormInput.probandInfo.birthdate,
            gender: {
              connect: {
                id: createVisitFormInput.probandInfo.genderId,
              },
            },
            nativeLanguage: {
              connect: {
                id: createVisitFormInput.probandInfo.nativeLanguageId,
              },
            },
            heightCm: createVisitFormInput.probandInfo.heightCm,
            weightKg: createVisitFormInput.probandInfo.weightKg,
            handedness: {
              connect: {
                id: createVisitFormInput.probandInfo.handednessId,
              },
            },
            visualCorrectionDioptre: createVisitFormInput.probandInfo.visualCorrectionDioptre,
            email: createVisitFormInput.probandInfo.email,
            phone: createVisitFormInput.probandInfo.phone,
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

  async update(id: string, updateVisitFormInput: UpdateVisitFormInput): Promise<VisitFormInclude> {
    return this.prisma.visitForm.update({
      where: {
        id,
      },
      data: {
        state: updateVisitFormInput.state,
        additionalInfo: updateVisitFormInput.additionalInfo
          ? {
              upsert: {
                create: {
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
        probandInfo: {
          update: updateVisitFormInput.probandInfo
            ? {
                name: updateVisitFormInput.probandInfo.name,
                surname: updateVisitFormInput.probandInfo.surname,
                personalId: updateVisitFormInput.probandInfo.personalId,
                birthdate: updateVisitFormInput.probandInfo.birthdate,
                gender: updateVisitFormInput.probandInfo.genderId
                  ? {
                      connect: {
                        id: updateVisitFormInput.probandInfo.genderId,
                      },
                    }
                  : undefined,
                nativeLanguage: updateVisitFormInput.probandInfo.nativeLanguageId
                  ? {
                      connect: {
                        id: updateVisitFormInput.probandInfo.nativeLanguageId,
                      },
                    }
                  : undefined,
                heightCm: updateVisitFormInput.probandInfo.heightCm,
                weightKg: updateVisitFormInput.probandInfo.weightKg,
                handedness: updateVisitFormInput.probandInfo.handednessId
                  ? {
                      connect: {
                        id: updateVisitFormInput.probandInfo.handednessId,
                      },
                    }
                  : undefined,
                visualCorrectionDioptre: updateVisitFormInput.probandInfo.visualCorrectionDioptre,
                email: updateVisitFormInput.probandInfo.email,
                phone: updateVisitFormInput.probandInfo.phone,
              }
            : {},
        },
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
