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
  }
}
`;
