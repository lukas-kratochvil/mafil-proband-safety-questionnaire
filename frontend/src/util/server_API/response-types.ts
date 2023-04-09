import {
  IApprovalRoomVisitFormDTO,
  IGenderDTO,
  IHandednessDTO,
  IHTMLCardDTO,
  INativeLanguageDTO,
  IQuestionDTO,
  IWaitingRoomTableVisitFormDTO,
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

export type CurrentQuestionsResponse = {
  data: {
    questions: IQuestionDTO[];
  };
};

export type QuestionResponse = {
  data: {
    question: IQuestionDTO;
  };
};

export type ProbandContactRequestResponse = {
  data: {
    probandContactRequest: IHTMLCardDTO;
  };
};

export type ProbandContactConsentResponse = {
  data: {
    probandContactConsent: IHTMLCardDTO;
  };
};

export type WaitingRoomTableVisitFormsResponse = {
  data: {
    visitForms: IWaitingRoomTableVisitFormDTO[];
  };
};

export type WaitingRoomVisitFormResponse = {
  data: {
    visitForm: IWaitingRoomVisitFormDTO;
  };
};

export type ApprovalRoomVisitFormsResponse = {
  data: {
    visitForms: IApprovalRoomVisitFormDTO[];
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

export type UpdateVisitFormResponse = {
  data: {
    updateVisitForm: {
      id: string;
    };
  };
};
