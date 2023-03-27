import { Injectable } from "@nestjs/common";
import { Prisma, VisitFormState } from "@prisma/client";
import { PrismaService } from "@app/prisma/prisma.service";
import { CreateVisitFormInput } from "./dto/create-visit-form.input";
import { UpdateVisitFormInput } from "./dto/update-visit-form.input";

const visitFormInclude = Prisma.validator<Prisma.VisitFormInclude>()({
  additionalInfo: true,
  probandInfo: {
    include: {
      gender: {
        include: {
          translations: {
            include: {
              language: true,
            },
          },
        },
      },
      nativeLanguage: {
        include: {
          translations: {
            include: {
              language: true,
            },
          },
        },
      },
      handedness: {
        include: {
          translations: {
            include: {
              language: true,
            },
          },
        },
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
    return await this.prisma.visitForm.create({
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
        additionalInfo: {
          update: updateVisitFormInput.additionalInfo
            ? {
                ...updateVisitFormInput.additionalInfo,
              }
            : undefined,
        },
        probandInfo: {
          update: updateVisitFormInput.probandInfo
            ? {
                ...updateVisitFormInput.probandInfo,
              }
            : undefined,
        },
        answers: {
          updateMany: updateVisitFormInput.answers
            ? updateVisitFormInput.answers.map((answer) => ({
                where: {
                  id: answer.id,
                },
                data: {
                  ...answer,
                },
              }))
            : undefined,
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
