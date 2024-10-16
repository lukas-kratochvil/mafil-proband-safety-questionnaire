import {
  gql,
  HTML_PROPS,
  OPERATOR_PROPS,
  ORDERED_TRANSLATION_ENTITY_PROPS,
  TRANSLATIONS_FRAGMENT,
  TRANSLATION_ENTITY_PROPS,
} from "./utils";

const AUTHENTICATE_OPERATOR = gql`
  query AuthenticateOperator($name: String!, $surname: String!, $username: String!, $email: String!) {
    authenticateOperator(name: $name, surname: $surname, username: $username, email: $email) {
      ${OPERATOR_PROPS}
    }
  }
`;

const GET_OPERATOR = gql`
query GetOperator($username: String!) {
  operator(username: $username) {
    ${OPERATOR_PROPS}
  }
}
`;

const GET_GENDERS = gql`
  query GetGenders {
    genders {
      ${ORDERED_TRANSLATION_ENTITY_PROPS}
    }
  }
`;

const GET_GENDER = gql`
  query GetGender($code: String!) {
    gender(code: $code) {
      ${TRANSLATION_ENTITY_PROPS}
    }
  }
`;

const GET_HANDEDNESSES = gql`
  query GetHandednesses {
    handednesses {
      ${ORDERED_TRANSLATION_ENTITY_PROPS}
    }
  }
`;

const GET_HANDEDNESS = gql`
  query GetHandedness($code: String!) {
    handedness(code: $code) {
      ${TRANSLATION_ENTITY_PROPS}
    }
  }
`;

const GET_CURRENT_QUESTIONS = gql`
  query GetCurrentQuestions {
    questions {
      id
      updatedAt
      partNumber
      mustBeApproved
      order
      ${TRANSLATIONS_FRAGMENT}
      hiddenByGenders {
        genderCode
      }
    }
  }
`;

const GET_QUESTION = gql`
  query GetQuestion($id: UUID!) {
    question(id: $id) {
      id
      partNumber
      order
      mustBeApproved
      ${TRANSLATIONS_FRAGMENT}
      hiddenByGenders {
        genderCode
      }
    }
  }
`;

const GET_ENTRY_INFO = gql`
  query GetEntryInfo($locale: String!) {
    entryInfo(locale: $locale) {
      ${HTML_PROPS}
    }
  }
`;

const GET_SAFETY_INFO = gql`
  query GetSafetyInfo($locale: String!) {
    safetyInfo(locale: $locale) {
      ${HTML_PROPS}
    }
  }
`;

const GET_BEFORE_EXAMINATION = gql`
  query GetBeforeExamination($locale: String!) {
    beforeExamination(locale: $locale) {
      ${HTML_PROPS}
    }
  }
`;

const GET_EXAMINATION_CONSENT = gql`
  query GetExaminationConsent($locale: String!) {
    examinationConsent(locale: $locale) {
      ${HTML_PROPS}
    }
  }
`;

const GET_PROBAND_CONTACT_REQUEST = gql`
  query GetProbandContactRequest($locale: String!, $name: String!, $surname: String!, $birthdateStr: String!, $currentDateStr: String!) {
    probandContactRequest(locale: $locale, name: $name, surname: $surname, birthdateStr: $birthdateStr, currentDateStr: $currentDateStr) {
      ${HTML_PROPS}
    }
  }
`;

const GET_PROBAND_CONTACT_CONSENT = gql`
  query GetProbandContactConsent($locale: String!) {
    probandContactConsent(locale: $locale) {
      ${HTML_PROPS}
    }
  }
`;

const GET_WAITING_ROOM_TABLE_VISIT_FORMS = gql`
  query GetWaitingRoomVisitForms($state: VisitFormState) {
    visitForms(state: $state) {
      id
      state
      createdAt
      name
      surname
      personalId
      birthdate
      gender {
        ${TRANSLATION_ENTITY_PROPS}
      }
      nativeLanguageCode
      heightCm
      weightKg
      visualCorrectionDioptre
      handedness {
        ${TRANSLATION_ENTITY_PROPS}
      }
      email
      phone
    }
  }
`;

const GET_WAITING_ROOM_VISIT_FORM = gql`
  query GetWaitingRoomVisitForm($id: UUID!) {
    visitForm(id: $id) {
      id
      state
      probandLanguage {
        code
      }
      name
      surname
      personalId
      birthdate
      gender {
        ${TRANSLATION_ENTITY_PROPS}
      }
      nativeLanguageCode
      heightCm
      weightKg
      visualCorrectionDioptre
      handedness {
        ${TRANSLATION_ENTITY_PROPS}
      }
      email
      phone
      answers {
        questionId
        answer
      }
    }
  }
`;

const GET_APPROVAL_ROOM_TABLE_VISIT_FORMS = gql`
  query GetApprovalRoomVisitForms($state: VisitFormState) {
    visitForms(state: $state) {
      id
      state
      createdAt
      name
      surname
      personalId
      birthdate
      gender {
        ${TRANSLATION_ENTITY_PROPS}
      }
      nativeLanguageCode
      heightCm
      weightKg
      visualCorrectionDioptre
      handedness {
        ${TRANSLATION_ENTITY_PROPS}
      }
      email
      phone
      additionalInfo {
        projectUuid
        deviceId
        measuredAt
      }
    }
  }
`;

const GET_APPROVAL_ROOM_VISIT_FORM = gql`
  query GetApprovalRoomVisitForm($id: UUID!) {
    visitForm(id: $id) {
      id
      state
      probandLanguage {
        code
      }
      name
      surname
      personalId
      birthdate
      gender {
        ${TRANSLATION_ENTITY_PROPS}
      }
      nativeLanguageCode
      heightCm
      weightKg
      visualCorrectionDioptre
      handedness {
        ${TRANSLATION_ENTITY_PROPS}
      }
      email
      phone
      additionalInfo {
        projectUuid
        deviceId
        measuredAt
        finalizer {
          username
        }
        finalizedAt
      }
      answers {
        questionId
        answer
        comment
      }
    }
  }
`;

const GENERATE_PDF = gql`
  query GeneratePDF(
    $name: String!
    $surname: String!
    $personalId: String!
    $birthdate: DateTime!
    $heightCm: Int!
    $weightKg: Int!
    $visualCorrectionDioptre: Float!
    $email: String!
    $phone: String!
    $probandLanguageCode: String
    $finalizerUsername: String!
    $approverUsername: String
    $projectAcronym: String!
    $measuredAt: DateTime!
    $visitId: String!
    $isPhantom: Boolean!
    $genderCode: String!
    $nativeLanguage: PDFNativeLanguage!
    $handednessCode: String!
    $answers: [PDFAnswer!]
  ) {
    generatePDF(
      name: $name
      surname: $surname
      personalId: $personalId
      birthdate: $birthdate
      heightCm: $heightCm
      weightKg: $weightKg
      visualCorrectionDioptre: $visualCorrectionDioptre
      email: $email
      phone: $phone
      probandLanguageCode: $probandLanguageCode
      finalizerUsername: $finalizerUsername
      approverUsername: $approverUsername
      projectAcronym: $projectAcronym
      measuredAt: $measuredAt
      visitId: $visitId
      isPhantom: $isPhantom
      genderCode: $genderCode
      nativeLanguage: $nativeLanguage
      handednessCode: $handednessCode
      answers: $answers
    ) {
      name
      content
    }
  }
`;

export {
  AUTHENTICATE_OPERATOR,
  GENERATE_PDF,
  GET_APPROVAL_ROOM_TABLE_VISIT_FORMS,
  GET_APPROVAL_ROOM_VISIT_FORM,
  GET_BEFORE_EXAMINATION,
  GET_CURRENT_QUESTIONS,
  GET_ENTRY_INFO,
  GET_EXAMINATION_CONSENT,
  GET_GENDER,
  GET_GENDERS,
  GET_HANDEDNESS,
  GET_HANDEDNESSES,
  GET_OPERATOR,
  GET_PROBAND_CONTACT_CONSENT,
  GET_PROBAND_CONTACT_REQUEST,
  GET_QUESTION,
  GET_SAFETY_INFO,
  GET_WAITING_ROOM_TABLE_VISIT_FORMS,
  GET_WAITING_ROOM_VISIT_FORM,
};
