declare module "express" {
  type UserContext = {
    username: string;
    name: string;
    surname: string;
    email: string;
  };

  interface Request {
    user?: UserContext;
  }
}

// ensures this file is a module (must contain `import` or `export`) and not a global-scoped script
export {};
