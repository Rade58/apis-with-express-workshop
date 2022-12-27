import type { Handler } from "express";
import prisma from "../db";
import type t from "../../types";
import { Update, UPDATE_STATUS } from "@prisma/client";

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
    res.json({ errors: [{ message: "Updates not found!" }] });
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

/**
 *
 * @param req
 * @param res
 * @description creates new update record
 */
export const createUpdate: Handler = async (req, res) => {
  const userId = req.user.id;
  const productId: string = req.body.productId;

  // find productId on a user
  const product = await prisma.product.findUnique({
    where: {
      id_belongsToId: {
        id: productId,
        belongsToId: userId,
      },
    },
  });

  if (!product) {
    res.status(401);
    res.json({
      errors: [
        {
          message:
            "product doesn't belong to the user, so Update record can't be created",
        },
      ],
    });
    return;
  }

  const update = await prisma.update.create({
    data: {
      product: {
        connect: {
          id: productId,
        },
      },
      title: req.body.title as string,
      body: req.body.body as string,
    },
  });

  res.status(201);
  res.json({
    data: {
      update,
    },
  });

  return;
};

/**
 *
 * @param req
 * @param res
 * @description updates update record
 */
export const updateUpdate: Handler = async (req, res) => {
  const userId = req.user.id;
  const updateId = req.params.id;

  // find productId on a user
  const product = await prisma.product.findFirst({
    where: {
      AND: {
        belongsToId: userId,
        updates: {
          some: {
            id: updateId,
          },
        },
      },
    },
    include: {
      belongsTo: {
        select: {
          id: true,
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
            "product doesn't belong to the user, so Update record can't be created",
        },
      ],
    });
    return;
  }

  const existingUpdate = await prisma.update.findUnique({
    where: {
      id_productId: {
        id: updateId,
        productId: product.id,
      },
    },
  });

  if (!existingUpdate) {
    res.status(401);
    res.json({
      errors: [{ message: "Update Record you want to update doesn't exist" }],
    });
    return;
  }

  const update = await prisma.update.update({
    where: {
      id_productId: {
        id: updateId,
        productId: req.body.productId as string,
      },
    },
    data: {
      title: (req.body.title as string | undefined)
        ? req.body.title
        : existingUpdate.title,
      body: (req.body.body as string | undefined)
        ? req.body.body
        : existingUpdate.body,
      status: req.body.status
        ? (req.body.status as UPDATE_STATUS)
        : existingUpdate.status,
      version: (req.body.version as string | undefined)
        ? req.body.version
        : existingUpdate.version,
      asset: (req.body.asset as string | undefined)
        ? req.body.asset
        : existingUpdate.asset,
      updatedAt: Date.now().toFixed(),
    },
  });

  res.status(200);
  res.json({
    data: {
      update,
    },
  });
  return;
};

/**
 *
 * @param req
 * @param res
 * @description delets update record
 */
export const deleteUpdate: Handler = async (req, res) => {
  const userId = req.user.id;
  const updateId = req.params.id;

  // find productId on a user
  const product = await prisma.product.findFirst({
    where: {
      AND: {
        belongsToId: userId,
        updates: {
          some: {
            id: updateId,
          },
        },
      },
    },
    include: {
      belongsTo: {
        select: {
          id: true,
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
            "product doesn't belong to the user, so Update record can't be created",
        },
      ],
    });
    return;
  }

  const deletedUpdate = await prisma.update.delete({
    where: {
      id_productId: {
        id: updateId,
        productId: product.id,
      },
    },
  });

  res.status(200);
  res.json({
    data: {
      deletedUpdate,
    },
  });
  return;
};
