import { PrismaClient } from "@prisma/client";
import genders from "./data/genders";
import handednesses from "./data/handednesses";
import questions from "./data/questions";

const prisma = new PrismaClient();

const createTranslation = (languageId: string, text: string) => ({
  languageId,
  text,
});

async function seed() {
  /**
   * Languages (locales) - ISO 639-1 (https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)
   */
  const cs = await prisma.language.create({
    data: {
      code: "cs",
      name: "Czech",
    },
  });
  const en = await prisma.language.create({
    data: {
      code: "en",
      name: "English",
    },
  });

  // Genders
  await Promise.all(
    genders.map((gender) =>
      prisma.gender.create({
        data: {
          code: gender.code,
          order: gender.order,
          translations: {
            createMany: {
              data: [createTranslation(cs.id, gender.csText), createTranslation(en.id, gender.enText)],
            },
          },
        },
      })
    )
  );

  // Handednesses
  await Promise.all(
    handednesses.map((handedness) =>
      prisma.handedness.create({
        data: {
          code: handedness.code,
          order: handedness.order,
          translations: {
            createMany: {
              data: [createTranslation(cs.id, handedness.csText), createTranslation(en.id, handedness.enText)],
            },
          },
        },
      })
    )
  );

  // Questions
  await Promise.all(
    questions.map((question) =>
      prisma.question.create({
        data: {
          partNumber: question.partNumber,
          mustBeApproved: question.partNumber === 2,
          order: question.order,
          isValid: true,
          translations: {
            createMany: {
              data: [createTranslation(cs.id, question.csText), createTranslation(en.id, question.enText)],
            },
          },
          hiddenByGenders: {
            createMany: {
              data:
                question.hiddenByGender === undefined
                  ? []
                  : question.hiddenByGender.map((genderCode) => ({ genderCode })),
            },
          },
        },
      })
    )
  );
}

seed()
  .then(async () => {
    console.log("Seeding finished successfully!");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.log("Something went wrong!");
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
