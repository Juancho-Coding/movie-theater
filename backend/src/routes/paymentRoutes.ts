import { Router } from "express";
import {
  authValidator,
  userExistValidator,
} from "../validators/authValidators";
import { makePayment } from "../controllers/paymentControllers";
import multer from "multer";
import { paymentValidator } from "../validators/paymentValidator";

const router = Router();

router.post(
  "/makePayment",
  authValidator,
  userExistValidator,
  paymentValidator,
  makePayment
);

export default router;
