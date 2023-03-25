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
            ...createVisitFormInput.probandInfo,
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

  async findAll(): Promise<VisitFormInclude[]> {
    return this.prisma.visitForm.findMany({
      where: {
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
        state: VisitFormState[updateVisitFormInput.state as keyof typeof VisitFormState],
        additionalInfo: {
          update: {
            ...updateVisitFormInput.additionalInfo,
          },
        },
        probandInfo: {
          update: {
            ...updateVisitFormInput.probandInfo,
          },
        },
        answers: {
          updateMany:
            updateVisitFormInput.answers === null
              ? undefined
              : updateVisitFormInput.answers.map((answer) => ({
                  where: {
                    id: answer.id,
                  },
                  data: {
                    ...answer,
                  },
                })),
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
        deletedAt: new Date(),
      },
      include: visitFormInclude,
    });
  }
}
