import { useEffect, useState } from "react";
import MoviesSection from "../MoviesSection";
import { Box } from "@mui/material";
import { movieData, Type } from "./constants";
import dayjs from "dayjs";
import { getMoviesByDate, getComingMovies } from "../../api/moviesApi";

const MovieSectionManager = () => {
  const [date, setDate] = useState(dayjs());
  const [movies, setMovies] = useState<movieData[] | null>(null);
  const [comingMovies, setComingMovies] = useState<movieData[] | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const result = await getMoviesByDate(date);
        setMovies(result);
      } catch (error) {
        // TODO handle error when fetching data
        console.log(error);
      }
    })();
  }, [date]);

  useEffect(() => {
    (async () => {
      try {
        const result = await getComingMovies();
        setComingMovies(result);
      } catch (error) {
        // TODO handle error when fetching data
        console.log(error);
      }
    })();
  }, []);

  return (
    <Box m="10px">
      {/*  Current movies section */}
      <Box mb="20px">
        <MoviesSection
          sectionName="On Screen"
          sectionType={Type.AVAILABLE}
          movies={movies}
          filterDay={date}
          minDay={dayjs("01-01-1990")}
          maxDay={dayjs().add(7, "day")}
          setDate={setDate}
        />
      </Box>
      {/*  Upcoming movies section */}
      <Box>
        <MoviesSection
          sectionName="Coming Soon"
          sectionType={Type.COMING_SOON}
          movies={comingMovies}
        />
      </Box>
    </Box>
  );
};

export default MovieSectionManager;
