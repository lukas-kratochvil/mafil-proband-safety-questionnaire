import {
  IApprovalRoomTableVisitFormDTO,
  IApprovalRoomVisitFormDTO,
  IGenderDTO,
  IHandednessDTO,
  IHTMLCardDTO,
  INativeLanguageDTO,
  IOperatorDTO,
  IQuestionDTO,
  IWaitingRoomTableVisitFormDTO,
  IWaitingRoomVisitFormDTO,
} from "./dto";

/**
 * Generic GraphQL API response type
 */
// TODO: this one is correct - data is null if error occurs
// type DataErrorsResponse<TData> = {
//   data: TData | null;
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
type DataErrorsResponse<TData> = {
  data: TData;
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

export type AuthenticateOperatorResponse = DataErrorsResponse<{ authenticateOperator: IOperatorDTO }>;

export type OperatorResponse = DataErrorsResponse<{ operator: IOperatorDTO }>;

export type GendersResponse = DataErrorsResponse<{ genders: IGenderDTO[] }>;

export type GenderResponse = DataErrorsResponse<{ gender: IGenderDTO }>;

export type NativeLanguagesResponse = DataErrorsResponse<{ nativeLanguages: INativeLanguageDTO[] }>;

export type NativeLanguageResponse = DataErrorsResponse<{ nativeLanguage: INativeLanguageDTO }>;

export type HandednessesResponse = DataErrorsResponse<{ handednesses: IHandednessDTO[] }>;

export type HandednessResponse = DataErrorsResponse<{ handedness: IHandednessDTO }>;

export type CurrentQuestionsResponse = DataErrorsResponse<{ questions: IQuestionDTO[] }>;

export type QuestionResponse = DataErrorsResponse<{ question: IQuestionDTO }>;

export type EntryInfoResponse = DataErrorsResponse<{ entryInfo: IHTMLCardDTO }>;

export type SafetyInfoResponse = DataErrorsResponse<{ safetyInfo: IHTMLCardDTO }>;

export type BeforeExaminationResponse = DataErrorsResponse<{ beforeExamination: IHTMLCardDTO }>;

export type ExaminationConsentResponse = DataErrorsResponse<{ examinationConsent: IHTMLCardDTO }>;

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
