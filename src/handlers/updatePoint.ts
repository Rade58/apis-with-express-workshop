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
export const createUpdatePoint: Handler = async (req, res) => {
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
export const updateUpdatePoint: Handler = async (req, res) => {
  const userId = req.user.id;
  const updatePointId = req.params.id;

  // finding relation between user and the updatePointId
  const product = await prisma.product.findFirst({
    where: {
      AND: {
        belongsToId: userId,
        updates: {
          some: {
            updatePoints: {
              some: {
                id: updatePointId,
              },
            },
          },
        },
      },
    },
    select: {
      updates: {
        select: {
          updatePoints: true,
        },
      },
    },
  });

  if (!product) {
    res.status(401);
    res.json({
      errors: [
        {
          message:
            "product which updatate point we want to update doesn't belong to the user",
        },
      ],
    });
    return;
  }

  const existingUpdatePoint = await prisma.updatePoint.findUnique({
    where: {
      id: updatePointId,
    },
  });

  if (!existingUpdatePoint) {
    res.status(401);
    res.json({
      errors: [
        { message: "UpdatePoint Record you want to update doesn't exist" },
      ],
    });
    return;
  }

  const updatePoint = await prisma.updatePoint.update({
    where: {
      id: updatePointId,
    },
    data: {
      name: req.body.name ? req.body.name : existingUpdatePoint.name,
      description: req.body.description
        ? req.body.description
        : existingUpdatePoint.description,
      updatedAt: Date.now().toFixed(),
    },
  });

  res.status(200);
  res.json({
    data: {
      updatePoint,
    },
  });
};
export const deleteUpdatePoint: Handler = async (req, res) => {
  //
  const userId = req.user.id;
  const updatePointId = req.params.id;

  // finding relation between user and the updatePointId
  const product = await prisma.product.findFirst({
    where: {
      AND: {
        belongsToId: userId,
        updates: {
          some: {
            updatePoints: {
              some: {
                id: updatePointId,
              },
            },
          },
        },
      },
    },
    select: {
      updates: {
        select: {
          updatePoints: true,
        },
      },
    },
  });

  if (!product) {
    res.status(401);
    res.json({
      errors: [
        {
          message:
            "product which updatate point we want to delete doesn't belong to the user",
        },
      ],
    });
    return;
  }

  const deletedUpdatePoint = await prisma.updatePoint.delete({
    where: {
      id: updatePointId,
    },
  });

  res.status(200);
  res.json({
    data: {
      deletedUpdatePoint,
    },
  });
};
