import { Router } from "express";
import { Request, Response, NextFunction } from "express";
import {
  authValidator,
  userExistValidator,
} from "../validators/authValidators";
import multer from "multer";
import { sendTicketEmail } from "../controllers/ticketsControllers";
import { emailValidator } from "../validators/ticketsValidator";

const router = Router();
// handles the files send through the request (pdf)
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/sendTicketEmail",
  upload.single("pdf"),
  authValidator,
  userExistValidator,
  emailValidator,
  sendTicketEmail
);

export default router;
