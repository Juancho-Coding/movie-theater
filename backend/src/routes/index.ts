import { Router } from "express";
import AuthRoutes from "./userRoutes";
import moviesRoutes from "./moviesRoutes";

export const router = Router();

router.use("/users", AuthRoutes);
router.use("/movies", moviesRoutes);

export default router;
