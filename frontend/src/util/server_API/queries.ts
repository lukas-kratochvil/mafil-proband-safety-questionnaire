export const AUTHENTICATE_OPERATOR = `
query AuthenticateOperator($name: String!, $surname: String!, $uco: String!, $email: String!) {
  authenticateOperator(name: $name, surname: $surname, uco: $uco, email: $email) {
    id
    name
    surname
    uco
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

export const GET_HANDEDNESSES = `
query GetHandednesses {
  handednesses {
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
    partNumber
    mustBeApproved
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

export const GET_WAITING_ROOM_VISIT_FORMS = `
query GetWaitingRoomVisitForms($state: VisitFormState) {
  visitForms(state: $state) {
    id
    createdAt
    name
    surname
    personalId
    birthdate
    gender {
      id
      translations {
        text
        language {
          code
        }
      }
    }
    nativeLanguage {
      id
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
      comment
    }
  }
}
`;

export const GET_WAITING_ROOM_VISIT_FORM = `
query GetWaitingRoomVisitForm($id: UUID!) {
  visitForm(id: $id) {
    name
    surname
    personalId
    birthdate
    gender {
      id
      translations {
        text
        language {
          code
        }
      }
    }
    nativeLanguage {
      id
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

export const GET_APPROVAL_ROOM_VISIT_FORMS = `
query GetWaitingRoomVisitForms($state: VisitFormState) {
  visitForms(state: $state) {
    id
    createdAt
    name
    surname
    personalId
    birthdate
    gender {
      id
      translations {
        text
        language {
          code
        }
      }
    }
    nativeLanguage {
      id
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
    answers {
      questionId
      answer
      comment
    }
  }
}
`;

export const GET_APPROVAL_ROOM_VISIT_FORM = `
query GetApprovalRoomVisitForm($id: UUID!) {
  visitForm(id: $id) {
    name
    surname
    personalId
    birthdate
    gender {
      id
      translations {
        text
        language {
          code
        }
      }
    }
    nativeLanguage {
      id
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
    }
    answers {
      questionId
      answer
      comment
    }
  }
}
`;
