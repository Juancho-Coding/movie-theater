import { Box } from "@mui/material";

import classes from "./MovieReservation.module.css";
import Header from "../components/header/Header";
import ReservationManager from "../components/reservation/ReservationManager";

const MovieReservation = () => {
  return (
    <Box className={classes.main_container}>
      {/* header section */}
      <Header />
      {/* steps section */}
      <ReservationManager />
    </Box>
  );
};

export default MovieReservation;
