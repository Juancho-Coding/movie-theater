import { useEffect, useState } from "react";
import MoviesSection from "../MoviesSection";
import { Box } from "@mui/material";
import { movieData, Type } from "./constants";
import dayjs from "dayjs";
import { getMovies } from "../../api/moviesSectionApi";

const MovieSectionManager = () => {
  const [date, setDate] = useState(dayjs());
  const [movies, setMovies] = useState<movieData[] | null>(null);
  const [comingMovies, setComingMovies] = useState<movieData[] | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const result = await getMovies(date);
        const filterScreen = result.filter((movie) => !movie.coming);
        const filterComing = result.filter((movie) => movie.coming);
        setMovies(filterScreen);
        setComingMovies(filterComing);
      } catch (error) {
        // TODO handle error when fetching data
        console.log(error);
      }
    })();
    // TODO fetch the movies and divide them into recent movies and coming soon movies
  }, [date]);

  return (
    <Box m="10px">
      {/*  Current movies section */}
      <Box mb="20px">
        <MoviesSection
          sectionName="On Screen"
          sectionType={Type.AVAILABLE}
          movies={movies}
          filterDay={date}
          minDay={dayjs()}
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
