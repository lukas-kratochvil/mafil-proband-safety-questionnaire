declare module "yup" {
  interface StringSchema {
    removeWhitespace(): this;
    normalizeWhitespace(): this;
    customEmail(): this;
    customPhoneNumber(): this;
  }
}

// ensures this file is a module (must contain `import` or `export`) and not a global-scoped script
export {};
