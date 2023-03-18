export const GENDERS_QUERY = `
query {
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

export const NATIVE_LANGUAGES_QUERY = `
query {
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

export const HANDEDNESSES_QUERY = `
query {
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

export const CURRENT_QUESTIONS_QUERY = `
query {
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

export const QUESTION_QUERY = `
query($id: UUID!) {
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
