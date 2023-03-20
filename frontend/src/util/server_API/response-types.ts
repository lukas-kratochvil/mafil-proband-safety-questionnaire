import { IQuestionDTO, ITranslatedEntityDTO } from "./dto";

export type GendersResponse = {
  data: {
    genders: ITranslatedEntityDTO[];
  };
};

export type NativeLanguagesResponse = {
  data: {
    nativeLanguages: ITranslatedEntityDTO[];
  };
};

export type HandednessesResponse = {
  data: {
    handednesses: ITranslatedEntityDTO[];
  };
};

export type QuestionsResponse = {
  data: {
    questions: IQuestionDTO[];
  };
};

export type QuestionResponse = {
  data: {
    question: IQuestionDTO;
  };
};
