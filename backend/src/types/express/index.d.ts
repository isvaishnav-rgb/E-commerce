import { IUser } from "../User.types";

declare global {
  namespace Express {
    interface Request {
      user?: IUser ;
    }
  }
}

export {};
