import type { NextFunction, Request, Response } from "express";
// import type * as t from "../../types";
import prisma from "../db";

import { createJWT, hashPassword, comparePasswords } from "../modules/auth";

interface UserDataForCreation {
  username: string;
  password: string;
}

export const createNewUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body: UserDataForCreation = req.body;

    const hashed = hashPassword(body.password);

    const user = await prisma.user.create({
      data: {
        username: body.username,
        password: hashed,
      },
    });

    const token = createJWT({
      username: user.username,
      id: user.id,
    });

    res.status(201);
    res.json({ token });
  } catch (err) {
    if (err instanceof Error) {
      next({ ...err, type: "input" });
    } else {
      next(new Error("input"));
    }
  }
};

export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body: { username: string; password: string } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        username: body.username,
      },
    });

    if (!user) {
      res.status(401);
      res.json({ message: "Not Authorized!" });
      return;
    }

    const isValid = comparePasswords(body.password, user.password);

    if (!isValid) {
      res.status(401);
      res.json({ message: "Not authorized!" });

      return;
    }

    const token = createJWT({ id: user.id, username: user.username });

    res.status(200);
    res.json({ token });
  } catch (err) {
    next(err);
    return;
  }
};
