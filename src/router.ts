import { NextFunction, Request, Response, Router } from "express";
import { UPDATE_STATUS } from "@prisma/client";

import { body /*  oneOf, validationResult */ } from "express-validator";

import { validateInputResult } from "./modules/middlewares";

import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./handlers/product";

import {
  getUpdates,
  getUpdate,
  createUpdate,
  updateUpdate,
  deleteUpdate,
} from "./handlers/update";

import {
  getUpdatePoints,
  getUpdatePoint,
  createUpdatePoint,
  updateUpdatePoint,
  deleteUpdatePoint,
} from "./handlers/updatePoint";

const router = Router();

/**
 * Product
 */
// get all products
router.get("/product", getProducts);
//
router.get("/product/:id", getProduct);
//
router.put(
  "/product/:id",
  [
    body("name")
      .exists({ checkNull: true })
      .withMessage("'name' field doesn't exist on body!")
      .isString()
      .withMessage("'name' field isn't a string!"),
    validateInputResult,
  ],
  updateProduct
);
// create product
router.post(
  "/product",
  [
    body("name")
      .exists()
      .withMessage("'name' doesn't exist on the body")
      .isString()
      .withMessage("'name' field isn't a string"),
    validateInputResult,
  ],
  createProduct
);
//
router.delete("/product/:id", deleteProduct);

/**
 * Update
 */
router.get("/update", getUpdates);
router.get("/update/:id", getUpdate);
router.put(
  "/update/:id",
  [
    body("productId")
      .exists()
      .withMessage("'productId' doesn't exist")
      .isString()
      .withMessage("'productId' isn't a string'"),
    body("title")
      .optional()
      .isString()
      .withMessage("'title' isn't a string'")
      .isLength({ min: 6, max: 255 })
      .withMessage(
        "'title string has less than 6 or more than 255 characters'"
      ),
    body("body").optional().isString().withMessage("'body' isn't a string'"),
    /* oneOf([
      body("status")
        .optional()
        .isString()
        .withMessage("'status' isn't a string'")
        .equals(UPDATE_STATUS.IN_PROGRESS)
        .withMessage("provided value for 'UPDATE_STATUS' not right value"),
      body("status")
        .optional()
        .isString()
        .withMessage("'status' isn't a string'")
        .equals(UPDATE_STATUS.ARCHIVED)
        .withMessage("provided value for 'UPDATE_STATUS' not right value"),
      body("status")
        .optional()
        .isString()
        .withMessage("'status' isn't a string'")
        .equals(UPDATE_STATUS.DEPRECATED)
        .withMessage("provided value for 'UPDATE_STATUS' not right value"),
      body("status")
        .optional()
        .isString()
        .withMessage("'status' isn't a string'")
        .equals(UPDATE_STATUS.LIVE)
        .withMessage("provided value for 'UPDATE_STATUS' not right value"),
    ]), */
    body("status")
      .isIn([
        UPDATE_STATUS.ARCHIVED,
        UPDATE_STATUS.DEPRECATED,
        UPDATE_STATUS.IN_PROGRESS,
        UPDATE_STATUS.LIVE,
      ])
      .withMessage("status doesn't have right value")
      .optional(),
    //
    body("version")
      .optional()
      .isString()
      .withMessage("'version' isn't a string'"),
    body("asset").optional().isString().withMessage("'asset' isn't a string'"),
    validateInputResult,
  ],
  updateUpdate
);
router.post(
  "/update",

  [
    body("productId")
      .exists()
      .withMessage("'productId' doesn't exist")
      .isString()
      .withMessage("'productId' isn't a string'"),
    body("title")
      .exists()
      .withMessage("'title' doesn't exist")
      .isString()
      .withMessage("'title' isn't a string'")
      .isLength({ min: 6, max: 255 })
      .withMessage(
        "'title string has less than 6 or more than 255 characters'"
      ),
    body("body").exists().isString().withMessage("'body' isn't a string'"),
    /* oneOf([
      body("status")
        .optional()
        .isString()
        .withMessage("'status' isn't a string'")
        .equals(UPDATE_STATUS.IN_PROGRESS)
        .withMessage("provided value for 'UPDATE_STATUS' not right value"),
      body("status")
        .optional()
        .isString()
        .withMessage("'status' isn't a string'")
        .equals(UPDATE_STATUS.ARCHIVED)
        .withMessage("provided value for 'UPDATE_STATUS' not right value"),
      body("status")
        .optional()
        .isString()
        .withMessage("'status' isn't a string'")
        .equals(UPDATE_STATUS.DEPRECATED)
        .withMessage("provided value for 'UPDATE_STATUS' not right value"),
      body("status")
        .optional()
        .isString()
        .withMessage("'status' isn't a string'")
        .equals(UPDATE_STATUS.LIVE)
        .withMessage("provided value for 'UPDATE_STATUS' not right value"),
    ]), */
    body("status")
      .isIn([
        UPDATE_STATUS.ARCHIVED,
        UPDATE_STATUS.DEPRECATED,
        UPDATE_STATUS.IN_PROGRESS,
        UPDATE_STATUS.LIVE,
      ])
      .withMessage("status doesn't have right value")
      .optional(),
    //
    body("version")
      .optional()
      .isString()
      .withMessage("'version' isn't a string'"),
    body("asset").optional().isString().withMessage("'asset' isn't a string'"),
    validateInputResult,
  ],
  createUpdate
);
router.delete("/update/:id", deleteUpdate);

/**
 * UpdatePoint
 */
router.get("/updatepoint", getUpdatePoints);
router.get("/updatepoint/:id", getUpdatePoint);
router.put(
  "/updatepoint/:id",
  [
    body("name")
      .optional()
      .isString()
      .withMessage("'name' isn't a string'")
      .isLength({ min: 6, max: 255 })
      .withMessage(
        "'name' string has less than 6 or more than 255 characters'"
      ),
    body("description")
      .optional()
      .isString()
      .withMessage("'description' isn't a string'"),
    validateInputResult,
  ],
  updateUpdatePoint
);
router.post(
  "/updatepoint",
  [
    body("updateId")
      .exists()
      .withMessage("'updateId' doesn't exist")
      .isString()
      .withMessage("'updatePoint' isn't a string"),
    body("name")
      .exists()
      .withMessage("'name' doesn't exist")
      .isString()
      .withMessage("'name' isn't a string")
      .isLength({ min: 6, max: 255 })
      .withMessage("'name' string has less than 6 or more than 255 characters"),
    body("description")
      .exists()
      .withMessage("'description' doesn't exist")
      .isString()
      .withMessage("'description' isn't a string"),
    validateInputResult,
  ],
  createUpdatePoint
);
router.delete("/updatepoint/:id", deleteUpdatePoint);

router.use(
  (
    err: Error & { type: string },
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (err.type === "auth") {
      res.status(401).json({ errors: [{ message: "Unauthorized!" }] });
      return;
    } else if (err.type === "input") {
      res.status(401).json({ errors: [{ message: "Invalid input!" }] });
      return;
    } else {
      res.status(500).json({ errors: [{ message: "Oooooops, our bad!" }] });
      return;
    }
  }
);

export default router;
