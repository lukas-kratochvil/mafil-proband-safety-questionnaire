// Extract operation name from the query
export const extractGraphQLOperationName = (query: string): string | undefined => {
  const match = query.match(/^\s*(query|mutation)\s(\w+).*/);
  return match ? match[2] : undefined;
};

// GraphQL tag
export const gql = String.raw;

//------------------------------------------------------------------------------------------
// Something like the GraphQL fragments, but just strings to be included in other strings.
//------------------------------------------------------------------------------------------
export const OPERATOR_PROPS = gql`
  id
  name
  surname
  username
  email
  role
`;

export const TRANSLATIONS_FRAGMENT = gql`
  translations {
    text
    language {
      code
      name
    }
  }
`;

export const TRANSLATION_ENTITY_PROPS = gql`
  id
  code
  ${TRANSLATIONS_FRAGMENT}
`;

export const ORDERED_TRANSLATION_ENTITY_PROPS = gql`
  order
  ${TRANSLATION_ENTITY_PROPS}
`;

export const HTML_PROPS = gql`
  title
  html
`;
