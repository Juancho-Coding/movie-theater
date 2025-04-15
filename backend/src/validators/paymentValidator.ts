import { body } from "express-validator";

export const paymentValidator = [
  body("session").exists().isNumeric().withMessage("The session id is missing"),
  body("schedule")
    .exists()
    .withMessage("The information for the payment is incomplete"),
  body("holder")
    .exists()
    .isLength({ min: 3 })
    .withMessage("The information for the payment is incomplete"),
  body("card")
    .exists()
    .withMessage("The information for the payment is incomplete"),
  body("cardExp")
    .exists()
    .withMessage("The information for the payment is incomplete"),
  body("cardCVV")
    .exists()
    .isNumeric()
    .withMessage("The information for the payment is incomplete"),
];
