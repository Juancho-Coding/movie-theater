import { LoaderFunctionArgs } from "react-router-dom";
import { checkMovieIsValid } from "../api/moviesApi";

export async function movieValidation({ params }: LoaderFunctionArgs) {
  const id = params.movieId ? parseInt(params.movieId) : -1;
  const timeId = params.timeId ? params.timeId : "";
  const date = params.date ? params.date : "";
  const { status } = await checkMovieIsValid(id, timeId, date);
  return status;
}
