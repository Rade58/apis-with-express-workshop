import { User } from "@prisma/client";

declare global {
  namespace Express {
    export interface Request {
      // shsh_secret: string;
      user: {
        id: User["id"];
        username: User["username"];
      };
    }
  }
}

export {};
