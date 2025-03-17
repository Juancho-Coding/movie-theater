import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import MovieDetails from "./MovieDetails";
import Reservation from "./Reservation";
import classes from "./ReservationManager.module.css";
import { getMoviesById } from "../../api/moviesApi";
import { movieData } from "../MovieCard/constants";
import dayjs from "dayjs";

const ReservationManager = () => {
  // stores the movie details
  const [movie, setMovie] = useState<movieData | null>(null);
  const params = useParams();
  const navigate = useNavigate();
  const movieId = params["movieId"];
  const timeId = params["timeId"];
  const date = params["date"];

  useEffect(() => {
    if (movieId === undefined || timeId === undefined || date === undefined) {
      // TODO Navigate to a page showing an error message instead of main page
      navigate("/");
    }
  }, [movieId, timeId, date, navigate]);

  useEffect(() => {
    (async () => {
      try {
        // first useEffect make sure the movieId is not undefined
        const result = await getMoviesById(parseInt(movieId!));
        setMovie(result);
      } catch (error) {
        console.log(error);
        // TODO Navigate to a page showing an error message instead of main page
        navigate("/");
      }
    })();
  }, [movieId, navigate]);

  return (
    <Box className={classes["reservation-container"]}>
      {/* left section shows the movie poster,  */}

      <Box className={classes["details-container"]}>
        <MovieDetails
          title={movie?.title || "Loading"}
          description={movie?.description || "Loading"}
          id={movie?.id || "Loading"}
          chips={
            movie
              ? [
                  movie.rating,
                  `Released: ${dayjs(movie.releaseDate).format("MMM YYYY")}`,
                  movie.language,
                  movie.doubled ? "Doubled: Yes" : "Doubled: No",
                  ...movie.chips,
                ]
              : []
          }
          imageUrl={{
            url: movie?.imageUrl.url || "",
            alt: movie?.imageUrl.alt || "",
          }}
        />
      </Box>
      {/* right section shows the steps to reserve */}
      <Box className={classes["reserve-container"]}>
        <Reservation />
      </Box>
    </Box>
  );
};

export default ReservationManager;
