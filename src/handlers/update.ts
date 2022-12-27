import type { Handler } from "express";
import prisma from "../db";
import type t from "../../types";
import { Update } from "@prisma/client";

/**
 *
 * @param req
 * @param res
 * @description get all updates for the user (no matter of related product)
 */
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
  return;
};

/**
 *
 * @param req
 * @param res
 * @description get exact update for the user (no matter of the product)
 */
export const getUpdate: Handler = async (req, res) => {
  const userId = req.user.id;
  const updateId = req.params.id;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      products: {
        where: {
          updates: {
            every: {
              id: updateId,
            },
          },
        },
        include: {
          updates: true,
        },
      },
    },
  });

  if (!user) {
    res.status(404);
    res.json({ errors: [{ message: "update not found" }] });
    return;
  }

  const update = user.products[0].updates[0];

  res.status(200);
  res.json({
    data: {
      update,
    },
  });
  return;
};

export const createUpdate: Handler = async (req, res) => {
  //
};

export const updateUpdate: Handler = async (req, res) => {
  //
};

export const deleteUpdate: Handler = async (req, res) => {
  //
};
