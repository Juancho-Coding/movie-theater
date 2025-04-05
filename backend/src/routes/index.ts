import { Router } from "express";
import AuthRoutes from "./userRoutes";
import moviesRoutes from "./moviesRoutes";
import reservationRoutes from "./reservationRoutes";
import paymentRoutes from "./paymentRoutes";
import ticketsRoutes from "./ticketsRoutes";

export const router = Router();

router.use("/users", AuthRoutes);
router.use("/movies", moviesRoutes);
router.use("/reserve", reservationRoutes);
router.use("/payment", paymentRoutes);
router.use("/tickets", ticketsRoutes);

export default router;
