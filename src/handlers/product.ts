import type { Handler } from "express";
import prisma from "../db";
import type t from "../../types";

export const getProducts: Handler = async (req, res) => {
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
};
