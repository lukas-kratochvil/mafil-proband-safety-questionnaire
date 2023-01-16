import { PrismaClient } from "@prisma/client";
import genders from "./seeding/genders";
import handedness from "./seeding/handedness";
import nativeLanguages from "./seeding/native-languages";
import questions from "./seeding/questions";

const prisma = new PrismaClient();

const createTranslation = (languageId: string, text: string) => ({
  languageId,
  text,
});

async function main() {
  // Languages (locales)
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

  // Native languages
  nativeLanguages.forEach(
    async (nativeLanguage) =>
      await prisma.nativeLanguage.create({
        data: {
          order: nativeLanguage.order,
          translations: {
            createMany: {
              data: [
                createTranslation(cs.id, nativeLanguage.csText),
                createTranslation(en.id, nativeLanguage.enText),
              ],
            },
          },
        },
      })
  );

  // Genders
  genders.forEach(
    async (gender) =>
      await prisma.gender.create({
        data: {
          code: gender.code,
          translations: {
            createMany: {
              data: [
                createTranslation(cs.id, gender.csText),
                createTranslation(en.id, gender.enText),
              ],
            },
          },
        },
      })
  );

  // Questions
  questions.forEach(
    async (question) =>
      await prisma.question.create({
        data: {
          partNumber: question.partNumber,
          mustBeApproved: question.partNumber === 2,
          isValid: true,
          translations: {
            createMany: {
              data: [
                createTranslation(cs.id, question.csText),
                createTranslation(en.id, question.enText),
              ],
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
  );

  // Handedness
  handedness.forEach(
    async (hand) =>
      await prisma.handedness.create({
        data: {
          translations: {
            createMany: {
              data: [
                createTranslation(cs.id, hand.csText),
                createTranslation(en.id, hand.enText),
              ],
            },
          },
        },
      })
  );
}

main()
  .catch(async (e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
