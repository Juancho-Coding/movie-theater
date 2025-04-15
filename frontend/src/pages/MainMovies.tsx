import { Box } from "@mui/material";
import classes from "./MainMovies.module.css";
import Header from "../components/header/Header";
import MovieSectionManager from "../components/MovieCard/MovieSectionManager";
import Carousel from "../components/Carousel/Carousel";

const MainMovies = () => {
  return (
    <Box className={classes.main_container}>
      {/* header section */}
      <Header />
      <Carousel />
      {/*  Current movies section */}
      <MovieSectionManager />
    </Box>
  );
};

export default MainMovies;
