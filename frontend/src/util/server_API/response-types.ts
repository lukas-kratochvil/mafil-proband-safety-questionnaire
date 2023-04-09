import {
  IApprovalRoomTableVisitFormDTO,
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

/**
 * Generic GraphQL API response type
 */
// TODO: this one is correct - data is null if error occurs
// type DataErrorsResponse<DataType> = {
//   data: DataType | null;
//   errors?: {
//     message: string;
//     extensions: {
//       code: string;
//       errors?: {
//         field: string;
//         errors: string[];
//       }[];
//     };
//   }[];
// };
type DataErrorsResponse<DataType> = {
  data: DataType;
  errors?: {
    message: string;
    extensions: {
      code: string;
      errors?: {
        field: string;
        errors: string[];
      }[];
    };
  }[];
};

export type AuthenticateOperatorResponse = DataErrorsResponse<{
  authenticateOperator: {
    id: string;
    name: string;
    surname: string;
    uco: string;
    email: string;
    role: OperatorRole;
  };
}>;

export type GendersResponse = DataErrorsResponse<{ genders: IGenderDTO[] }>;

export type NativeLanguagesResponse = DataErrorsResponse<{ nativeLanguages: INativeLanguageDTO[] }>;

export type HandednessesResponse = DataErrorsResponse<{ handednesses: IHandednessDTO[] }>;

export type CurrentQuestionsResponse = DataErrorsResponse<{ questions: IQuestionDTO[] }>;

export type QuestionResponse = DataErrorsResponse<{ question: IQuestionDTO }>;

export type ProbandContactRequestResponse = DataErrorsResponse<{ probandContactRequest: IHTMLCardDTO }>;

export type ProbandContactConsentResponse = DataErrorsResponse<{ probandContactConsent: IHTMLCardDTO }>;

export type WaitingRoomTableVisitFormsResponse = DataErrorsResponse<{ visitForms: IWaitingRoomTableVisitFormDTO[] }>;

export type WaitingRoomVisitFormResponse = DataErrorsResponse<{ visitForm: IWaitingRoomVisitFormDTO }>;

export type ApprovalRoomTableVisitFormsResponse = DataErrorsResponse<{ visitForms: IApprovalRoomTableVisitFormDTO[] }>;

export type ApprovalRoomVisitFormResponse = DataErrorsResponse<{ visitForm: IApprovalRoomVisitFormDTO }>;

export type CreateVisitFormResponse = DataErrorsResponse<{
  createVisitForm: {
    id: string;
  };
}>;

export type UpdateVisitFormResponse = DataErrorsResponse<{
  updateVisitForm: {
    id: string;
  };
}>;
