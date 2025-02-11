import { Box } from "@mui/material";
import classes from "./MainMovies.module.css";

const MainMovies = () => {
  return (
    <Box className={classes.main_container}>
      {/* header section */}
      <Box>header section</Box>
      {/*  Current movies section */}
      <Box>Current movies section</Box>
      {/*  Upcoming movies section */}
      <Box>Upcoming movies section</Box>
    </Box>
  );
};

export default MainMovies;
