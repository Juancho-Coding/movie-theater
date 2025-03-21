import { Box, Paper, Typography } from "@mui/material";
import classes from "./MoviesSection.module.css";
import { DatePicker } from "@mui/x-date-pickers";
import MovieCard from "./MovieCard/MovieCard";
import { movieData, Type } from "./MovieCard/constants";
import dayjs from "dayjs";

const MoviesSection = ({
  sectionType,
  sectionName,
  movies,
  filterDay,
  minDay,
  maxDay,
  setDate,
}: props) => {
  const showFilter = sectionType === Type.AVAILABLE;
  return (
    <Paper elevation={2} className={`${classes["content-container"]} `}>
      {/*------ Section title ------*/}
      <Box
        mb="10px"
        p="10px"
        sx={{ backgroundColor: "#AD343E", alignItems: "center" }}
      >
        <Typography color="white" variant="h4" textAlign="center">
          {sectionName}
        </Typography>
      </Box>
      {/*------ Filter for filtering movies by date ------*/}
      {showFilter && (
        <Box className={classes["filter-container"]}>
          <Typography>Filter by Date:</Typography>
          <DatePicker
            slotProps={{ textField: { size: "small" } }}
            format="DD-MM-YYYY"
            value={filterDay}
            minDate={minDay}
            maxDate={maxDay}
            onChange={(date) => {
              if (date && setDate) setDate(date);
            }}
          />
        </Box>
      )}
      {/*------- Shows the list of movies -------*/}
      <Box className={classes["movies-container"]}>
        {movies &&
          movies.map((movie) => (
            <MovieCard
              key={movie.id}
              id={movie.id}
              title={movie.title}
              description={movie.description}
              chips={movie.chips}
              times={movie.times}
              imageUrl={movie.imageUrl}
            />
          ))}
        {/* TODO show a component with empty movies */}
        {!movies && <Box>No movies available</Box>}
      </Box>
    </Paper>
  );
};

interface props {
  sectionName: string;
  sectionType: Type;
  movies: movieData[] | null;
  filterDay?: dayjs.Dayjs;
  minDay?: dayjs.Dayjs;
  maxDay?: dayjs.Dayjs;
  setDate?: React.Dispatch<React.SetStateAction<dayjs.Dayjs>>;
}

export default MoviesSection;
