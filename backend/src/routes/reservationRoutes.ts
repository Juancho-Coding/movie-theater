import { Router } from "express";
import { generateReservation } from "../controllers/reservationControllers";
import { reserveValidator } from "../validators/reserveValidators";
import { authValidator } from "../validators/authValidators";

const router = Router();

router.post(
  "/reserveSeats",
  authValidator,
  reserveValidator,
  generateReservation
);

export default router;
