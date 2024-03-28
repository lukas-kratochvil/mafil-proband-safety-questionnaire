import type { OrderedQuestionDTO } from "@app/util/server_API/dto";
import { NEUTRAL_LANGUAGE_CODE } from "../neutral-language-code";

export const questionsTest: OrderedQuestionDTO[] = [
  {
    id: "p1q01",
    order: 1,
    updatedAt: new Date(),
    partNumber: 1,
    mustBeApproved: false,
    translations: [
      {
        text: "Question1",
        language: {
          code: NEUTRAL_LANGUAGE_CODE,
        },
      },
    ],
    hiddenByGenders: [],
  },
  {
    id: "p1q02",
    order: 2,
    updatedAt: new Date(),
    partNumber: 1,
    mustBeApproved: false,
    translations: [
      {
        text: "Question2",
        language: {
          code: NEUTRAL_LANGUAGE_CODE,
        },
      },
    ],
    hiddenByGenders: [],
  },
  {
    id: "p2q01",
    order: 3,
    updatedAt: new Date(),
    partNumber: 2,
    mustBeApproved: true,
    translations: [
      {
        text: "Question3",
        language: {
          code: NEUTRAL_LANGUAGE_CODE,
        },
      },
    ],
    hiddenByGenders: [],
  },
  {
    id: "p2q02",
    order: 4,
    updatedAt: new Date(),
    partNumber: 2,
    mustBeApproved: true,
    translations: [
      {
        text: "Question4",
        language: {
          code: NEUTRAL_LANGUAGE_CODE,
        },
      },
    ],
    hiddenByGenders: [],
  },
];
