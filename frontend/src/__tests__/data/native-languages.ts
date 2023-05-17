import { IOrderedNativeLanguageDTO } from "@app/util/server_API/dto";
import { NEUTRAL_LANGUAGE_CODE } from "../neutral-language-code";

export const nativeLanguagesDev: IOrderedNativeLanguageDTO[] = [
  {
    id: "1",
    code: "cs",
    order: 1,
    translations: [
      {
        text: "Czech",
        language: {
          code: NEUTRAL_LANGUAGE_CODE,
        },
      },
    ],
  },
  {
    id: "2",
    code: "sk",
    order: 2,
    translations: [
      {
        text: "Slovak",
        language: {
          code: NEUTRAL_LANGUAGE_CODE,
        },
      },
    ],
  },
  {
    id: "3",
    code: "en",
    order: 3,
    translations: [
      {
        text: "English",
        language: {
          code: NEUTRAL_LANGUAGE_CODE,
        },
      },
    ],
  },
];
