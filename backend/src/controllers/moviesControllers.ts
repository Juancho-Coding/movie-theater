import { Request, Response, NextFunction } from "express";
import {
  validationResponse,
  validationResults,
} from "../utils/validationResult";
import { dbQuery } from "../db/postgres";

type movieData = {
  id: number;
  title: string;
  description: string | null;
  release_date: Date;
  show_date?: Date;
  times?: string[];
  imageurl: string;
  rating: string | null;
  duration: number;
  language: string | null;
  doubled: boolean;
  chips: string[];
};

/**
 * Get the movies that currently are on screen.
 * @date query param for the date of the schedule
 * @time query param for the time of the schedule
 * @returns
 */
export async function getMoviesBySchedule(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const date = req.query.date;
    const time = req.query.time;
    //checks for validation error before continuing
    validationResults(req);
    // search the db for movies that are scheduled for the date and time
    const movies = await dbQuery(
      `SELECT m.id, m.title, m.description, m.release_date, s.show_date,
        ARRAY_AGG(s.show_time ORDER BY s.show_time) as times,
        m.imageurl, m.duration, m.rating, m.language, m.doubled, m.chips
        FROM schedules AS s
        JOIN movies AS m ON m.id = s.movie_id
        WHERE show_date = $1
        AND show_time >= $2
        GROUP BY m.id, m.title, m.description, m.release_date, m.duration,
        m.imageurl, m.rating, m.language, m.doubled, m.chips,
        s.show_date`,
      [date, time]
    );
    const formattedMovies = movies.rows.map((movie: movieData) => {
      return {
        id: movie.id,
        title: movie.title,
        description: movie.description,
        imageurl: movie.imageurl,
        release_date: movie.release_date,
        show_date: movie.show_date,
        duration: movie.duration,
        times: movie.times,
        rating: movie.rating,
        language: movie.language,
        doubled: movie.doubled,
        chips: movie.chips,
      };
    });
    res.status(200).json(formattedMovies);
    return;
  } catch (error) {
    console.log(error);
    // checks if the error was a validation error
    if (validationResponse(error, res)) return;
    res.status(500).json({ error: "Internal error server" });
  }
}

/**
 * Gets the movies marked as coming movies
 */
export async function getComingMovies(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    //checks for validation error before continuing
    validationResults(req);
    // search the db for movies that are scheduled for the date and time
    const movies = await dbQuery(
      `SELECT m.title, m.description, m.release_date, m.imageurl, m.duration,
      m.rating, m.language, m.doubled, m.chips
      FROM movies AS m WHERE m.status = 1 ORDER BY m.title`,
      []
    );
    const formattedMovies = movies.rows.map((movie: movieData) => {
      return {
        id: movie.title,
        title: movie.title,
        description: movie.description,
        imageurl: movie.imageurl,
        release_date: movie.release_date,
        duration: movie.duration,
        rating: movie.rating,
        language: movie.language,
        doubled: movie.doubled,
        chips: movie.chips,
      };
    });
    res.status(200).json(formattedMovies);
    return;
  } catch (error) {
    console.log(error);
    // checks if the error was a validation error
    if (validationResponse(error, res)) return;
    res.status(500).json({ error: "Internal error server" });
  }
}

/**
 * Get the movie details by id
 * @id query param for the movie id
 */
export async function getMovieById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = req.query.id;
    //checks for validation error before continuing
    validationResults(req);
    // search the db for movies that are scheduled for the date and time
    const movies = await dbQuery(
      `SELECT m.id, m.title, m.description, m.release_date, m.imageurl, m.duration,
      m.rating, m.language, m.doubled, m.chips
      FROM movies AS m WHERE m.id = $1`,
      [id]
    );
    const formattedMovie = {
      id: movies.rows[0].id,
      title: movies.rows[0].title,
      description: movies.rows[0].description,
      imageurl: movies.rows[0].imageurl,
      release_date: movies.rows[0].release_date,
      duration: movies.rows[0].duration,
      rating: movies.rows[0].rating,
      language: movies.rows[0].language,
      doubled: movies.rows[0].doubled,
      chips: movies.rows[0].chips,
    };
    res.status(200).json(formattedMovie);
    return;
  } catch (error) {
    console.log(error);
    // checks if the error was a validation error
    if (validationResponse(error, res)) return;
    res.status(500).json({ error: "Internal error server" });
  }
}
