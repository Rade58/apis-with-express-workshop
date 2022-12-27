import type { Handler } from "express";
import prisma from "../db";
import type t from "../../types";
import { Update } from "@prisma/client";

export const getUpdates: Handler = async (req, res) => {
  const userId = req.user.id;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      products: {
        select: {
          updates: true,
        },
      },
    },
  });

  if (!user) {
    res.status(404);
    res.json({ errors: [{ message: "updates not found" }] });
    return;
  }

  const updates: Update[] = [];

  user.products.forEach(({ updates: upds }) => {
    for (const update of upds) {
      updates.push(update);
    }
  });

  res.status(200);
  res.json({
    data: {
      updates,
    },
  });
};

export const getUpdate: Handler = async (req, res) => {
  const userId = req.user.id;
};
