import { Request, Response, Router } from "express";
import { prisma, UPDATE_STATUS } from "@prisma/client";

import { body, oneOf, validationResult } from "express-validator";

import { validateInputResult } from "./modules/middlewares";

const router = Router();

/**
 * Product
 */
// get all products
router.get("/product", (req, res) => {
  res.json({ product: "all" });
  // res.status(200).send({ message: req.shsh_secret });
  //
  //
});
//
router.get("/product/:id", (req, res) => {});
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
  async (req: Request, res: Response) => {
    //

    console.log("It's ok");
    res.end();
    return;
  }
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
  async (req: Request, res: Response) => {
    // TODO
    // CONNECT PRODUCT TO THE USER
  }
);
//
router.delete("/product/:id", (req, res) => {
  console.log(req.query);
  console.log(req.params);
  res.end();
});

/**
 * Update
 */
router.get("/update", (req, res) => {});
router.get("/update/:id", (req, res) => {});
router.put(
  "/update/:id",
  [
    body("title")
      .optional()
      .isString()
      .withMessage("'title' isn't a string'")
      .isLength({ min: 6, max: 255 })
      .withMessage(
        "'title string has less than 6 or more than 255 characters'"
      ),
    body("body").optional().isString().withMessage("'body' isn't a string'"),
    oneOf([
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
    ]),
    body("version")
      .optional()
      .isString()
      .withMessage("'version' isn't a string'"),
    body("asset").optional().isString().withMessage("'asset' isn't a string'"),
    validateInputResult,
  ],
  (req: Request, res: Response) => {
    if (body.length === 0) {
      res.status(400);
      res.json({ errors: [{ message: "Body is empty" }] });
    }
  }
);
router.post(
  "/update",

  [
    body("title")
      .exists()
      .isString()
      .withMessage("'title' isn't a string'")
      .isLength({ min: 6, max: 255 })
      .withMessage(
        "'title string has less than 6 or more than 255 characters'"
      ),
    body("body").exists().isString().withMessage("'body' isn't a string'"),
    oneOf([
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
    ]),
    body("version")
      .optional()
      .isString()
      .withMessage("'version' isn't a string'"),
    body("asset").optional().isString().withMessage("'asset' isn't a string'"),
    validateInputResult,
  ],
  (req: Request, res: Response) => {
    if (body.length === 0) {
      res.status(400);
      res.json({ errors: [{ message: "Body is empty" }] });
    }
  }
);
router.delete("/update/:id", (req, res) => {});

/**
 * UpdatePoint
 */
router.get("/updatepoint", (req, res) => {});
router.get("/updatepoint/:id", (req, res) => {});
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
  (req: Request, res: Response) => {
    if (body.length === 0) {
      res.status(400);
      res.json({ errors: [{ message: "Body is empty" }] });
    }
  }
);
router.post(
  "/updatepoint",
  [
    body("name")
      .exists()
      .isString()
      .withMessage("'name' isn't a string'")
      .isLength({ min: 6, max: 255 })
      .withMessage(
        "'name' string has less than 6 or more than 255 characters'"
      ),
    body("description")
      .exists()
      .isString()
      .withMessage("'description' isn't a string'"),
    validateInputResult,
  ],
  (req: Request, res: Response) => {
    if (body.length === 0) {
      res.status(400);
      res.json({ errors: [{ message: "Body is empty" }] });
    }
  }
);
router.delete("/updatepoint/:id", (req, res) => {});

export default router;
