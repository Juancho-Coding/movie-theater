import { Box } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import MovieDetails from "./MovieDetails";
import StepReservation from "./StepReservation";

import classes from "./ReservationManager.module.css";

const ReservationManager = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const movieTime = searchParams.get("time");
  if (movieTime === null) navigate("/");

  return (
    <Box className={classes["reservation-container"]}>
      {/* left section shows the movie poster,  */}

      <Box className={classes["details-container"]}>
        <MovieDetails
          title="Scary Movie"
          description="Cindy dddddddddddddddddd ddddddddddddddddd ddddddddddddddddddddddddddddddddddddddd ddddddddddd ddddddddddddddddddddddddCampbell and her friends mistakenly end up killing a man. A year after the unfortunate incident, someone stalks them, leaves threatening messages and tries to murder them one by one."
          id="sadadasdasd"
          chips={[
            "A1",
            "1:32min",
            "A1",
            "1:32min",
            "A1",
            "1:32min",
            "A1",
            "1:32min",
            "A1",
            "1:32min",
            "A1",
            "1:32min",
          ]}
          imageUrl={{
            url: "https://m.media-amazon.com/images/I/51yh0V1CWTL._AC_UF894,1000_QL80_.jpg",
            alt: "Scary Movie poster",
          }}
        />
      </Box>
      {/* right section shows the steps to reserve */}
      <Box flexGrow="1">
        <StepReservation />
      </Box>
    </Box>
  );
};

export default ReservationManager;
