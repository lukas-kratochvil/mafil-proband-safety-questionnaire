import "express";

type UserContext = {
  username: string;
  name: string;
  surname: string;
  email: string;
};

declare module "express" {
  interface Request {
    user?: UserContext;
  }
}
