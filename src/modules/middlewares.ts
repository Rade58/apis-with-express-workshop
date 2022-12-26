import type { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

export const validateResult = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400);

    const errorsArray = errors.array();

    res.json({ errors: errorsArray });
    return;
  }

  next();
  return;
};
