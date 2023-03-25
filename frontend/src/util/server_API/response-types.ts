import {
  IApprovalRoomVisitFormDTO,
  IGenderDTO,
  IHandednessDTO,
  INativeLanguageDTO,
  IQuestionDTO,
  IWaitingRoomVisitFormDTO,
  OperatorRole,
} from "./dto";

export type AuthenticateOperatorResponse = {
  data: {
    authenticateOperator: {
      id: string;
      name: string;
      surname: string;
      uco: string;
      email: string;
      role: OperatorRole;
    };
  };
};

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

export type WaitingRoomVisitFormResponse = {
  data: {
    visitForm: IWaitingRoomVisitFormDTO;
  };
};

export type ApprovalRoomVisitFormResponse = {
  data: {
    visitForm: IApprovalRoomVisitFormDTO;
  };
};

export type CreateVisitFormResponse = {
  data: {
    createVisitForm: {
      id: string;
    };
  };
};
