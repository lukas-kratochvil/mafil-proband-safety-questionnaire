import { IOrderedHandednessDTO } from "@app/util/server_API/dto";
import { NEUTRAL_LANGUAGE_CODE } from "../neutral-language-code";

export const handednessesTest: IOrderedHandednessDTO[] = [
  {
    id: "1",
    code: "r",
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
    code: "l",
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
    code: "rl",
    translations: [
      {
        text: "Retrained left-handed",
        language: {
          code: NEUTRAL_LANGUAGE_CODE,
        },
      },
    ],
  },
  {
    id: "4",
    code: "u",
    translations: [
      {
        text: "Undetermined",
        language: {
          code: NEUTRAL_LANGUAGE_CODE,
        },
      },
    ],
  },
].map((handedness, i) => ({
  ...handedness,
  order: i + 1,
}));
