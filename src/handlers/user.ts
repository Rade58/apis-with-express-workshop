import type { Request, Response } from "express";
import type * as t from "../types";
import prisma from "../db";

import { createJWT, hashPassword } from "../modules/auth";

interface UserData {
  username: string;
  password: string;
}

export const createNewUser = async (req: Request, res: Response) => {
  const body: UserData = req.body;

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

  res.json({ token });
};
