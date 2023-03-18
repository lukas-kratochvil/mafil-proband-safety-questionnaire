import { ITranslatedEntity } from "@app/interfaces/visit";

export type GendersResponse = {
  data: {
    genders: ITranslatedEntity[];
  };
};

export type NativeLanguagesResponse = {
  data: {
    nativeLanguages: ITranslatedEntity[];
  };
};

export type HandednessesResponse = {
  data: {
    handednesses: ITranslatedEntity[];
  };
};
