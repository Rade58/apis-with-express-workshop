import type { Handler } from "express";
import prisma from "../db";
import type t from "../../types";
import { UpdatePoint } from "@prisma/client";

/**
 *
 * @param req
 * @param res
 * @description getting update points records of certain user
 */
export const getUpdatePoints: Handler = async (req, res) => {
  const userId = req.user.id;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      products: {
        select: {
          updates: {
            select: {
              updatePoints: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    res.status(404);
    res.json({ errors: [{ message: "UpdatePoints not found!" }] });
    return;
  }

  const updatePoints: UpdatePoint[] = [];

  user.products.map(({ updates }) => {
    for (const { updatePoints: ups } of updates) {
      updatePoints.push(...ups);
    }
  });

  res.status(200);
  res.json({
    data: {
      updatePoints,
    },
  });

  return;
};

export const getUpdatePoint: Handler = async (req, res) => {
  //
  const userId = req.user.id;
  const updatePointId = req.params.id;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      products: {
        select: {
          updates: {
            select: {
              updatePoints: {
                where: {
                  id: updatePointId,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!user) {
    res.status(404);
    res.json({ errors: [{ message: "update point not found" }] });
    return;
  }

  const updatePoint = user.products[0].updates[0].updatePoints[0];

  res.status(200);
  res.json({
    data: {
      updatePoint,
    },
  });
  return;
};

/**
 *
 * @param req
 * @param res
 * @description creates update point
 */
export const createUpdatePoints: Handler = async (req, res) => {
  //
  const userId = req.user.id;
  const updateId: string = req.body.updateId;

  const update = await prisma.update.findFirst({
    where: {
      AND: {
        id: updateId,
        product: {
          belongsToId: userId,
        },
      },
    },
  });

  if (!update) {
    res.status(401);
    res.json({
      errors: [
        {
          message:
            "product you want to update doesn't belong to the user, so UpdatePoint record can't be created",
        },
      ],
    });
    return;
  }

  const updatePoint = await prisma.updatePoint.create({
    data: {
      update: {
        connect: {
          id: update.id,
        },
      },
      name: req.body.name as string,
      description: req.body.description as string,
    },
  });

  res.status(201);

  res.json({
    data: {
      updatePoint,
    },
  });

  return;
};

//
//
export const updateUpdatePoints: Handler = async (req, res) => {
  //
};
export const deleteUpdatePoints: Handler = async (req, res) => {
  //
};
