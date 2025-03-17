import { Router } from "express";
import AuthRoutes from "./userRoutes";
import moviesRoutes from "./moviesRoutes";
import reservationRoutes from "./reservationRoutes";

export const router = Router();

router.use("/users", AuthRoutes);
router.use("/movies", moviesRoutes);
router.use("/reserve", reservationRoutes);

export default router;
