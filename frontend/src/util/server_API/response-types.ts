import { ITranslatedEntity } from "./dto";

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
