import dayjs from "dayjs";
import BASEURL from "./apiHelper";
import { movieData } from "../components/MovieCard/constants";

/**
 * Call the movie api to get the movies for the specified date
 * @param date the date by which the movies are filtered
 * @returns list of movie objects with detailed information
 */
export const getMoviesByDate = async (
  date: dayjs.Dayjs
): Promise<movieData[]> => {
  const url = new URL(`${BASEURL}/movies/moviesbydatetime`);
  url.searchParams.set("date", date.format("YYYY-MM-DD"));
  url.searchParams.set("time", date.format("HH:mm"));
  const response = await fetch(url.toString());
  if (!response.ok) {
    const cause = await response.json();
    throw new Error(cause.msg);
  }
  const data: {
    id: string;
    title: string;
    description: string;
    imageurl: string;
    release_date: string;
    show_date: string;
    duration: number;
    times: string[];
    rating: string;
    language: string;
    doubled: boolean;
    chips: string[];
  }[] = await response.json();
  const movies: movieData[] = data.map((movie) => {
    return {
      id: movie.id,
      title: movie.title,
      description: movie.description,
      chips: movie.chips,
      times: movie.times,
      imageUrl: {
        url: movie.imageurl,
        alt: movie.title + " poster",
      },
      releaseDate: movie.release_date,
      duration: movie.duration,
      rating: movie.rating,
      language: movie.language,
      doubled: movie.doubled,
      coming: false,
    };
  });
  return movies;
};

/**
 * get the movies that are marked as coming
 * @returns movies list
 */
export const getComingMovies = async (): Promise<movieData[]> => {
  const response = await fetch(`${BASEURL}/movies/comingmovies`);
  if (!response.ok) {
    const cause = await response.json();
    throw new Error(cause.msg);
  }
  const data: {
    id: string;
    title: string;
    description: string;
    imageurl: string;
    release_date: string;
    duration: number;
    rating: string;
    language: string;
    doubled: boolean;
    chips: string[];
  }[] = await response.json();
  const movies: movieData[] = data.map((movie) => {
    return {
      id: movie.id,
      title: movie.title,
      description: movie.description,
      chips: movie.chips,
      times: [],
      imageUrl: {
        url: movie.imageurl,
        alt: movie.title + " poster",
      },
      releaseDate: movie.release_date,
      duration: movie.duration,
      rating: movie.rating,
      language: movie.language,
      doubled: movie.doubled,
      coming: false,
    };
  });
  return movies;
};

/**
 * get movie details according with its id
 * @param id identifier of the movie
 * @returns movie details
 */
export const getMoviesById = async (id: number) => {
  const url = new URL(`${BASEURL}/movies/moviebyid`);
  url.searchParams.set("id", id.toString());
  const response = await fetch(url.toString());
  if (!response.ok) {
    const cause = await response.json();
    throw new Error(cause.msg);
  }
  const data: {
    id: string;
    title: string;
    description: string;
    imageurl: string;
    release_date: string;
    show_date: string;
    duration: number;
    times: string[];
    rating: string;
    language: string;
    doubled: boolean;
    chips: string[];
  } = await response.json();
  const movie: movieData = {
    id: data.id,
    title: data.title,
    description: data.description,
    chips: data.chips,
    times: data.times,
    imageUrl: {
      url: data.imageurl,
      alt: data.title + " poster",
    },
    releaseDate: data.release_date,
    duration: data.duration,
    rating: data.rating,
    language: data.language,
    doubled: data.doubled,
    coming: false,
  };
  return movie;
};
