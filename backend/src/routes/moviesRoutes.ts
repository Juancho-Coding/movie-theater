import { Router } from "express";

import {
  getMoviesBySchedule,
  getComingMovies,
} from "../controllers/moviesControllers";
import { movieFilterValidator } from "../validators/movieFilterValidator";

export const router = Router();

router.get("/moviesbydatetime", movieFilterValidator, getMoviesBySchedule);
router.get("/comingmovies", getComingMovies);

export default router;
