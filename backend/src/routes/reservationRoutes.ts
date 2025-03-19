import { Router } from "express";
import {
  deleteSeat,
  generateReservation,
  reserveSeat,
} from "../controllers/reservationControllers";
import {
  reserveValidator,
  reserveSeatValidator,
} from "../validators/reserveValidators";
import {
  authValidator,
  userExistValidator,
} from "../validators/authValidators";

const router = Router();

router.post(
  "/reserveSeats",
  authValidator,
  userExistValidator,
  reserveValidator,
  generateReservation
);

router.post(
  "/reserveSingleSeat",
  authValidator,
  userExistValidator,
  reserveSeatValidator,
  reserveSeat
);

router.delete(
  "/removeReservedSeat/:session/:row/:column",
  authValidator,
  userExistValidator,
  deleteSeat
);

export default router;
