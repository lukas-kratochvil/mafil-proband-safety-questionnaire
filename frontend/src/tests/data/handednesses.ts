import type { HandednessDTO } from "@app/util/server_API/dto";
import { NEUTRAL_LANGUAGE_CODE } from "../neutral-language-code";

export const handednessesTest: HandednessDTO[] = [
  {
    id: "1",
    order: 1,
    code: "RH",
    translations: [
      {
        text: "Right-handed",
        language: {
          code: NEUTRAL_LANGUAGE_CODE,
        },
      },
    ],
  },
  {
    id: "2",
    order: 2,
    code: "LH",
    translations: [
      {
        text: "Left-handed",
        language: {
          code: NEUTRAL_LANGUAGE_CODE,
        },
      },
    ],
  },
  {
    id: "3",
    order: 3,
    code: "FL",
    translations: [
      {
        text: "Forced left-handed",
        language: {
          code: NEUTRAL_LANGUAGE_CODE,
        },
      },
    ],
  },
  {
    id: "4",
    order: 4,
    code: "UN",
    translations: [
      {
        text: "Undetermined",
        language: {
          code: NEUTRAL_LANGUAGE_CODE,
        },
      },
    ],
  },
];
