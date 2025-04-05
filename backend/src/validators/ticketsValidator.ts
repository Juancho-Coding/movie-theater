import { body } from "express-validator";

export const emailValidator = [
  body("email").isEmail().withMessage("Invalid email"),
  body("movie").notEmpty().withMessage("Movie name is required"),
  body("time").notEmpty().withMessage("Time is required"),
  body("pdf").custom((value, { req }) => {
    if (!req.file) {
      throw new Error("PDF file is required");
    }
    return true;
  }),
];
