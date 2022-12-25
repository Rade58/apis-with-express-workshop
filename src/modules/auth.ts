import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import type { User } from "@prisma/client";

// FOR SOME REASON I NEED TO IMPORT FROM THIS FILE
// IN ORDER TO AUGMENTATION ON Request TO BE APPLIED
// BUT THIS IS JUST IN CASE WHEN I'M DEFINING MIDDLEWARE
// IN CASE WHEN I EXPLICITLY AM ASSERTING Request TYPE FOR SOMETHING
// THIS I DON'T NEED TO DO IF I AM USING METHODS LIKE get, or use, or post (IN THAT CASE Request OBJECT IS AUGMENTED PROPERLY)
import * as types from "../types";

/**
 *
 * @param user
 * @returns jwt (string)
 * @description taking a user and creating jwt from user data
 */
export const createJWT = (user: User) => {
  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET as string
  );

  return token;
};

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns nothing
 * @description taking token from the cookie and inserting
 * user on req
 */
export const protect = (req: Request, res: Response, next: NextFunction) => {
  const bearer = req.headers.authorization;

  console.log({ bearer });
  if (!bearer) {
    res.status(401);
    res.json({ message: "Not authorized!" });
    return;
  }

  // FIRST PART OF THIS IS Bearer WORD
  // WE WNT TOKEN (A SECOND PART)
  const [_, token] = bearer.split(" ");

  if (!token) {
    console.log("no token inside cookie!");
    res.status(401);
    res.json({ message: "Not authorized!" });
    return;
  }

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as Exclude<typeof req.user, undefined>;

    req.user = payload;

    console.log({ payload });

    next();
    return;
  } catch (err) {
    res.status(401);

    if (err instanceof Error) {
      res.json({ message: err.message + "!" });
    } else {
      res.json({ message: "Not authorized!" });
    }

    return;
  }
};

/**
 *
 * @param password
 * @param hash
 * @returns boolean
 */
export const comparePasswords = (password: string, hash: string) => {
  return bcrypt.compareSync(password, hash);
};

/**
 *
 * @param password
 * @returns string (hashed password)
 */
export const hashPassword = (password: string) => {
  return bcrypt.hashSync(password, 5);
};
