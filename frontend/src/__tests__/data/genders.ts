import { IOrderedGenderDTO } from "@app/util/server_API/dto";
import { NEUTRAL_LANGUAGE_CODE } from "../neutral-language-code";

export const gendersDev: IOrderedGenderDTO[] = [
  {
    id: "1",
    code: "M",
    translations: [
      {
        text: "Male",
        language: {
          code: NEUTRAL_LANGUAGE_CODE,
        },
      },
    ],
  },
  {
    id: "2",
    code: "F",
    translations: [
      {
        text: "Female",
        language: {
          code: NEUTRAL_LANGUAGE_CODE,
        },
      },
    ],
  },
  {
    id: "3",
    code: "O",
    translations: [
      {
        text: "Other",
        language: {
          code: NEUTRAL_LANGUAGE_CODE,
        },
      },
    ],
  },
].map((gender, i) => ({
  ...gender,
  order: i + 1,
}));
