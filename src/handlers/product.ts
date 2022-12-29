import type { Handler } from "express";
import prisma from "../db";
import type t from "../../types"; // because Request augmentation

/**
 *
 * @param req
 * @param res
 * @description gts all products of the user
 */
export const getProducts: Handler = async (req, res, next) => {
  try {
    //
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      include: {
        products: true,
      },
    });

    if (!user) {
      res.status(404);
      res.json({ errors: [{ message: "products not found" }] });
      return;
    }

    res.status(200);
    res.json({ data: { products: user.products } });
    return;
    //
  } catch (err) {
    next(err);
    return;
  }
};

/**
 *
 * @param req
 * @param res
 * @description gets the product for the user
 */
export const getProduct: Handler = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const userId = req.user.id;

    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        belongsToId: userId,
      },
    });

    if (!product) {
      res.status(404);
      res.json({ errors: [{ message: "product not found" }] });
      return;
    }

    res.status(200);
    res.json({
      data: {
        product,
      },
    });
    return;
  } catch (err) {
    next(err);
    return;
  }
};

/**
 *
 * @param req
 * @param res
 * @description creates a product for the user
 */
export const createProduct: Handler = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const product = await prisma.product.create({
      data: {
        name: req.body.name as string,
        belongsTo: {
          connect: {
            id: userId,
          },
        },
      },
    });

    res.status(201);

    res.json({ data: { product } });

    return;
  } catch (err) {
    next(err);

    return;
  }
};

/**
 *
 * @param req
 * @param res
 * @description updates product
 */
export const updateProduct: Handler = async (req, res, next) => {
  try {
    //
    const productId = req.params.id;
    const userId = req.user.id;
    // MAYBE WE SHOULD HAVE DO A CHECK IF PRODUCT BELONGS TO THE USER
    /* const user = await prisma.user.findFirst({
    where: {
      AND: {
        id: userId,
        products: {
          some: {
            id: productId,
          },
        },
      },
    },
  });

  if (!user) {
    res.status(401);
    res.json({
      errors: [
        {
          message:
            "product update not allowed since product doesn't belong to the user",
        },
      ],
    });
    return;
  } */

    const product = await prisma.product.update({
      where: {
        // WE HAD TO WRITE COMPOUND INDEX IN SCHEMA FOR THIS TO WORK
        id_belongsToId: {
          belongsToId: userId,
          id: productId,
        },
      },
      data: {
        name: req.body.name,
        // belongsToId: userId,
      },
    });

    res.status(200);
    res.json({ data: { product } });
    return;
  } catch (err) {
    next(err);
    return;
  }
};

export const deleteProduct: Handler = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const userId = req.user.id;
    // MAYBE WE SHOULD HAVE DO A CHECK IF PRODUCT BELONGS TO THE USER
    /* const user = await prisma.user.findFirst({
    where: {
      AND: {
        id: userId,
        products: {
          some: {
            id: productId,
          },
        },
      },
    },
  });

  if (!user) {
    res.status(401);
    res.json({
      errors: [
        {
          message:
            "product delete not allowed since product doesn't belong to the user",
        },
      ],
    });
    return;
  } */

    const deletedProduct = await prisma.product.delete({
      where: {
        // WE HAD TO WRITE COMPOUND INDEX IN SCHEMA FOR THIS TO WORK
        id_belongsToId: { belongsToId: userId, id: productId },
      },
    });

    res.status(200);
    res.jsonp({
      data: {
        deletedProduct,
      },
    });
  } catch (err) {
    next(err);

    return;
  }
};
