import { IQuestionEntity, ITranslatedEntity } from "./dto";

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

export type QuestionsResponse = {
  data: {
    questions: IQuestionEntity[];
  };
};

export type QuestionResponse = {
  data: {
    question: IQuestionEntity;
  };
};
