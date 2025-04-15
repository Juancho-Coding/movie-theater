import { Router } from "express";

import {
  getMoviesBySchedule,
  getComingMovies,
  getMovieById,
  getMovieIsValid,
} from "../controllers/moviesControllers";
import { movieFilterValidator } from "../validators/movieFilterValidator";

export const router = Router();

router.get("/moviesbydatetime", movieFilterValidator, getMoviesBySchedule);
router.get("/comingmovies", getComingMovies);
router.get("/moviebyid", getMovieById);
router.get("/movieIsValid", getMovieIsValid);

export default router;
