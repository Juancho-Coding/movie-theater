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
    throw new Error(cause.message);
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

export const getComingMovies = async (): Promise<movieData[]> => {
  const response = await fetch(`${BASEURL}/movies/comingmovies`);
  if (!response.ok) {
    const cause = await response.json();
    throw new Error(cause.message);
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
