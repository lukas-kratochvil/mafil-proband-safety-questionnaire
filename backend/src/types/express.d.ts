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

export {};
