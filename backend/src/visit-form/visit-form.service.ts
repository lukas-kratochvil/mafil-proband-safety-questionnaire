import { Injectable } from "@nestjs/common";
import { PrismaService } from "@prisma/prisma.service";
import { CreateVisitFormInput } from "./dto/create-visit-form.input";
import { UpdateVisitFormInput } from "./dto/update-visit-form.input";
import { Prisma } from "@prisma/client";

const visitFormInclude = Prisma.validator<Prisma.VisitFormInclude>()({
  additionalInfo: true,
  probandInfo: true,
  answers: true,
});

const visitFormArgs = Prisma.validator<Prisma.VisitFormArgs>()({
  include: visitFormInclude,
});
type VisitFormInclude = Prisma.VisitFormGetPayload<typeof visitFormArgs>;

@Injectable()
export class VisitFormService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createVisitFormInput: CreateVisitFormInput): Promise<VisitFormInclude> {
    const visitForm = await this.prismaService.visitForm.create({
      data: {
        state: createVisitFormInput.state,
        probandLanguage: {
          connect: {
            id: createVisitFormInput.probandLanguageId,
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

    if (createVisitFormInput.additionalInfo === null) {
      return visitForm;
    }

    return this.prismaService.visitForm.update({
      where: {
        id: visitForm.id,
      },
      data: {
        additionalInfo: {
          create: {
            ...createVisitFormInput.additionalInfo,
          },
        },
      },
      include: visitFormInclude,
    });
  }

  async findAll(): Promise<VisitFormInclude[]> {
    return this.prismaService.visitForm.findMany({
      where: {
        deletedAt: null,
      },
      include: visitFormInclude,
    });
  }

  async findOne(id: string): Promise<VisitFormInclude> {
    return this.prismaService.visitForm.findUniqueOrThrow({
      where: {
        id,
      },
      include: visitFormInclude,
    });
  }

  async update(id: string, updateVisitFormInput: UpdateVisitFormInput): Promise<VisitFormInclude> {
    updateVisitFormInput.answers?.forEach((answer) =>
      this.prismaService.answer.update({
        where: {
          id: answer.id,
        },
        data: {
          ...answer,
        },
      })
    );
    return this.prismaService.visitForm.update({
      where: {
        id,
      },
      data: {
        state: updateVisitFormInput.state,
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
      },
      include: visitFormInclude,
    });
  }

  async remove(id: string): Promise<VisitFormInclude> {
    return this.prismaService.visitForm.update({
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
