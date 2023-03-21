import { IGenderDTO, IHandednessDTO, INativeLanguageDTO, IQuestionDTO } from "./dto";

export type GendersResponse = {
  data: {
    genders: IGenderDTO[];
  };
};

export type NativeLanguagesResponse = {
  data: {
    nativeLanguages: INativeLanguageDTO[];
  };
};

export type HandednessesResponse = {
  data: {
    handednesses: IHandednessDTO[];
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

export type CreateVisitFormResponse = {
  data: {
    createVisitForm: {
      id: string;
    };
  };
};
