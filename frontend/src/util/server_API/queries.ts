export const AUTHENTICATE_OPERATOR = `
query AuthenticateOperator($name: String!, $surname: String!, $username: String!, $email: String!) {
  authenticateOperator(name: $name, surname: $surname, username: $username, email: $email) {
    id
    name
    surname
    username
    email
    role
  }
}
`;

export const GET_OPERATOR = `
query GetOperator($username: String!) {
  operator(username: $username) {
    id
    name
    surname
    username
    email
    role
  }
}
`;

export const GET_GENDERS = `
query GetGenders {
  genders {
    id
    code
    order
    translations {
      text
      language {
        code
        name
      }
    }
  }
}
`;

export const GET_GENDER = `
query GetGender($code: String!) {
  gender(code: $code) {
    id
    code
    translations {
      text
      language {
        code
        name
      }
    }
  }
}
`;

export const GET_NATIVE_LANGUAGES = `
query GetNativeLanguages {
  nativeLanguages {
    id
    code
    order
    translations {
      text
      language {
        code
        name
      }
    }
  }
}
`;

export const GET_NATIVE_LANGUAGE = `
query GetNativeLanguage($code: String!) {
  nativeLanguage(code: $code) {
    id
    code
    translations {
      text
      language {
        code
        name
      }
    }
  }
}
`;

export const GET_HANDEDNESSES = `
query GetHandednesses {
  handednesses {
    id
    code
    order
    translations {
      text
      language {
        code
        name
      }
    }
  }
}
`;

export const GET_HANDEDNESS = `
query GetHandedness($code: String!) {
  handedness(code: $code) {
    id
    code
    translations {
      text
      language {
        code
        name
      }
    }
  }
}
`;

export const GET_CURRENT_QUESTIONS = `
query GetCurrentQuestions {
  questions {
    id
    updatedAt
    partNumber
    mustBeApproved
    order
    translations {
      text
      language {
        code
        name
      }
    }
    hiddenByGenders {
      genderCode
    }
  }
}
`;

export const GET_QUESTION = `
query GetQuestion($id: UUID!) {
  question(id: $id) {
    id
    partNumber
    mustBeApproved
    translations {
      text
      language {
        code
        name
      }
    }
    hiddenByGenders {
      genderCode
    }
  }
}
`;

export const GET_ENTRY_INFO = `
query GetEntryInfo($locale: String!) {
  entryInfo(locale: $locale) {
    title
    html
  }
}
`;

export const GET_SAFETY_INFO = `
query GetSafetyInfo($locale: String!) {
  safetyInfo(locale: $locale) {
    title
    html
  }
}
`;

export const GET_BEFORE_EXAMINATION = `
query GetBeforeExamination($locale: String!) {
  beforeExamination(locale: $locale) {
    title
    html
  }
}
`;

export const GET_EXAMINATION_CONSENT = `
query GetExaminationConsent($locale: String!) {
  examinationConsent(locale: $locale) {
    title
    html
  }
}
`;

export const GET_PROBAND_CONTACT_REQUEST = `
query GetProbandContactRequest($locale: String!, $name: String!, $surname: String!, $birthdateStr: String!, $currentDateStr: String!) {
  probandContactRequest(locale: $locale, name: $name, surname: $surname, birthdateStr: $birthdateStr, currentDateStr: $currentDateStr) {
    title
    html
  }
}
`;

export const GET_PROBAND_CONTACT_CONSENT = `
query GetProbandContactConsent($locale: String!) {
  probandContactConsent(locale: $locale) {
    title
    html
  }
}
`;

export const GET_WAITING_ROOM_TABLE_VISIT_FORMS = `
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
      id
      code
      translations {
        text
        language {
          code
        }
      }
    }
    nativeLanguage {
      id
      code
      translations {
        text
        language {
          code
        }
      }
    }
    heightCm
    weightKg
    visualCorrectionDioptre
    handedness {
      id
      code
      translations {
        text
        language {
          code
        }
      }
    }
    email
    phone
  }
}
`;

export const GET_WAITING_ROOM_VISIT_FORM = `
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
      id
      code
      translations {
        text
        language {
          code
        }
      }
    }
    nativeLanguage {
      id
      code
      translations {
        text
        language {
          code
        }
      }
    }
    heightCm
    weightKg
    visualCorrectionDioptre
    handedness {
      id
      code
      translations {
        text
        language {
          code
        }
      }
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

export const GET_APPROVAL_ROOM_TABLE_VISIT_FORMS = `
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
      id
      code
      translations {
        text
        language {
          code
        }
      }
    }
    nativeLanguage {
      id
      code
      translations {
        text
        language {
          code
        }
      }
    }
    heightCm
    weightKg
    visualCorrectionDioptre
    handedness {
      id
      code
      translations {
        text
        language {
          code
        }
      }
    }
    email
    phone
    additionalInfo {
      projectId
      projectAcronym
      deviceId
      deviceName
      measuredAt
    }
  }
}
`;

export const GET_APPROVAL_ROOM_VISIT_FORM = `
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
      id
      code
      translations {
        text
        language {
          code
        }
      }
    }
    nativeLanguage {
      id
      code
      translations {
        text
        language {
          code
        }
      }
    }
    heightCm
    weightKg
    visualCorrectionDioptre
    handedness {
      id
      code
      translations {
        text
        language {
          code
        }
      }
    }
    email
    phone
    additionalInfo {
      projectId
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

export const GENERATE_PDF = `
query GeneratePDF($name: String!, $surname: String!, $personalId: String!, $birthdate: DateTime!, $heightCm: Float!, $weightKg: Float!, $visualCorrectionDioptre: Float!, $email: String!, $phone: String!, $probandLanguageCode: String, $finalizerUsername: String!, $approverUsername: String, $projectAcronym: String!, $measuredAt: DateTime!, $visitId: String!, $isPhantom: Boolean!, $genderCode: String!, $nativeLanguageCode: String!, $handednessCode: String!, $answers: [PDFAnswer!]){
  generatePDF(name: $name, surname: $surname, personalId: $personalId, birthdate: $birthdate, heightCm: $heightCm, weightKg: $weightKg, visualCorrectionDioptre: $visualCorrectionDioptre, email: $email, phone: $phone, probandLanguageCode: $probandLanguageCode, finalizerUsername: $finalizerUsername, approverUsername: $approverUsername, projectAcronym: $projectAcronym, measuredAt: $measuredAt, visitId: $visitId, isPhantom: $isPhantom, genderCode: $genderCode, nativeLanguageCode: $nativeLanguageCode, handednessCode: $handednessCode, answers: $answers) {
    name
    extension
    content
  }
}
`;
