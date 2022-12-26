import { Router } from "express";

import { body, validationResult } from "express-validator";

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
  body("name")
    .exists({ checkNull: true })
    .withMessage("'name' field doesn't exist on body!")
    .isString()
    .withMessage("'name' field isn't a string!"),
  async (req, res) => {
    //
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400);
      //
      const errorsArray = errors.array();

      // console.log({ errorsArray });
      // console.log(process.env.DATABASE_URL);

      res.json({ errors: errorsArray });
      return;
    }
    console.log("It's ok");
    res.end();
    return;
  }
);
// create product
router.post("/product", (req, res) => {});
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
router.put("/update/:id", (req, res) => {});
router.post("/update", (req, res) => {});
router.delete("/update/:id", (req, res) => {});

/**
 * UpdatePoint
 */
router.get("/updatepoint", (req, res) => {});
router.get("/updatepoint/:id", (req, res) => {});
router.put("/updatepoint/:id", (req, res) => {});
router.post("/updatepoint", (req, res) => {});
router.delete("/updatepoint/:id", (req, res) => {});

export default router;
