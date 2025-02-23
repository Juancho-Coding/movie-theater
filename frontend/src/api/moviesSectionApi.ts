import dayjs from "dayjs";
import BASEURL, { ApiError } from "./apiHelper";
import { movieData } from "../components/MovieCard/constants";

/**
 * Call the movie api to get the movies for the specified date
 * @param date the date by which the movies are filtered
 * @returns list of movie objects with detailed information
 */
export const getMovies = async (
  date: dayjs.Dayjs,
  showing: boolean = true
): Promise<movieData[]> => {
  if (false) {
    const url = new URL(`${BASEURL}/movies/get-movies-date`);
    url.searchParams.set("date", date.format("DD-MM-YYYY"));
    url.searchParams.set("show", `${showing ? "true" : "false"}`);
    const response = await fetch(url.toString());
    if (!response.ok) {
      const cause = await response.json();
      if (response.status === 401) throw new ApiError(401, cause.error);
      throw new Error(cause.error);
    }
    const data = await response.json();
    return data;
  } else {
    return movies;
  }
};

/**
 * Return the movie's information according to the id
 * @param id
 * @returns
 */
export const getMovieById = async (id: string) => {
  if (false) {
    const url = new URL(`${BASEURL}/movies/get-movies-id`);
    url.searchParams.set("id", id);
    const response = await fetch(url.toString());
    if (!response.ok) {
      const cause = await response.json();
      if (response.status === 401) throw new ApiError(401, cause.error);
      throw new Error(cause.error);
    }
    const data = await response.json();
    return data;
  } else {
    return moviesId;
  }
};

const movies = [
  {
    id: "1231312321",
    title: "Scary Movie",
    description:
      "Cindy Campbell and her friends mistakenly end up killing a man. A year after the unfortunate incident, someone stalks them, leaves threatening messages and tries to murder them one by one.",
    chips: ["A12", "DOB"],
    times: ["12:00", "2:00", "4:00"],
    imageUrl: {
      url: "https://m.media-amazon.com/images/I/51yh0V1CWTL._AC_UF894,1000_QL80_.jpg",
      alt: "Scary Movie poster",
    },
    coming: false,
  },
  {
    id: "9876543210",
    title: "Inception",
    description:
      "A thief who enters the dreams of others to steal secrets from their subconscious is given a chance to have his past crimes forgiven, by implanting an idea into someone's mind.",
    chips: ["B15", "SUB"],
    times: ["10:30", "1:30", "6:00"],
    imageUrl: {
      url: "https://m.media-amazon.com/images/I/91pXXQipyYL._SX342_.jpg",
      alt: "Inception movie poster",
    },
    coming: false,
  },
  {
    id: "4567891234",
    title: "The Dark Knight",
    description:
      "When the menace known as The Joker emerges, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    chips: ["B15", "DOB"],
    times: ["3:00", "6:00", "9:00"],
    imageUrl: {
      url: "https://m.media-amazon.com/images/I/41L848xYq3L._SX300_SY300_QL70_FMwebp_.jpg",
      alt: "The Dark Knight movie poster",
    },
    coming: false,
  },
  {
    id: "1122334455",
    title: "Titanic",
    description:
      "A young man and woman from different social classes fall in love aboard the ill-fated R.M.S. Titanic.",
    chips: ["A", "SUB"],
    times: ["12:00", "3:30", "8:00"],
    imageUrl: {
      url: "https://m.media-amazon.com/images/I/51vxeO22eqL._SX300_SY300_QL70_FMwebp_.jpg",
      alt: "Titanic movie poster",
    },
    coming: false,
  },
  {
    id: "9988776655",
    title: "The Matrix",
    description:
      "A computer hacker learns about the true nature of his reality and his role in the war against its controllers.",
    chips: ["B15", "DOB"],
    times: ["2:00", "5:00", "8:30"],
    imageUrl: {
      url: "https://m.media-amazon.com/images/I/41m8jptuINL._SX300_SY300_QL70_FMwebp_.jpg",
      alt: "The Matrix movie poster",
    },
    coming: false,
  },
  {
    id: "2233445566",
    title: "Interstellar",
    description:
      "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    chips: ["A12", "SUB"],
    times: ["11:00", "3:00", "7:00"],
    imageUrl: {
      url: "https://m.media-amazon.com/images/I/517lO67RbOL._SX300_SY300_QL70_FMwebp_.jpg",
      alt: "Interstellar movie poster",
    },
    coming: true,
  },
  {
    id: "6655443322",
    title: "Joker",
    description:
      "In Gotham City, mentally troubled comedian Arthur Fleck embarks on a downward spiral of revolution and bloody crime. This path brings him face-to-face with his alter-ego: The Joker.",
    chips: ["C", "DOB"],
    times: ["4:00", "7:00", "10:00"],
    imageUrl: {
      url: "https://m.media-amazon.com/images/I/415KdlFEzIL._SX300_SY300_QL70_FMwebp_.jpg",
      alt: "Joker movie poster",
    },
    coming: true,
  },
];

const moviesId = {
  id: "1231312321",
  title: "Scary Movie",
  description:
    "Cindy Campbell and her friends mistakenly end up killing a man. A year after the unfortunate incident, someone stalks them, leaves threatening messages and tries to murder them one by one.",
  chips: ["A12", "DOB"],
  imageUrl: {
    url: "https://m.media-amazon.com/images/I/51yh0V1CWTL._AC_UF894,1000_QL80_.jpg",
    alt: "Scary Movie poster",
  },
};
