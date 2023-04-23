import { INativeLanguageDTO } from "@app/util/server_API/dto";

export const nativeLanguagesDev: INativeLanguageDTO[] = [
  {
    id: "1",
    code: "cs",
    order: 1,
    translations: [
      {
        text: "Czech",
        language: {
          code: "cimode",
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
          code: "cimode",
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
          code: "cimode",
        },
      },
    ],
  },
];
