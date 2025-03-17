import {
  Box,
  Button,
  Divider,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import classes from "./SeatReservationStep.module.css";

import AuthContext from "../../context/AuthContext";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { useContext, useEffect, useState } from "react";
import { getResevationSeats } from "../../api/reservationApi";
import { useNavigate, useParams } from "react-router-dom";
import { ApiError } from "../../api/apiHelper";
import toast from "react-hot-toast";
import Seat from "./Seat";
import Auditorium from "./Auditorium";

// TODO change for a configuration parameteralld by an api
const MAX_SEATS = 5;

const SeatReservationStep = () => {
  const params = useParams();
  const navigate = useNavigate();
  // when this component is loaded the page verification is already done so
  // this components exists
  const movieId = params["movieId"]!;
  const timeId = params["timeId"]!;
  const date = params["date"]!;
  const { userData, logout } = useContext(AuthContext);
  // stores the number of seats desired
  const [numberseats, setNumberSeats] = useState(1);
  // store the steps to modify UI
  const [step, setStep] = useState(1);
  // stores the selected seats
  const [selSeats, setSelSeats] = useState<{ row: number; column: number }[]>(
    []
  );
  // stores the layout ofthe auditorium
  const [layout, setLayout] = useState<number[][]>([]);

  // Validates the movies parameters exists before sending a reservation
  useEffect(() => {
    if (movieId === undefined || timeId === undefined || date === undefined) {
      // TODO Navigate to a page showing an error message instead of main page
      navigate("/");
    }
  }, [movieId, timeId, date, navigate]);

  const getSeatsHandler = async () => {
    try {
      const result = await getResevationSeats(
        userData?.token,
        parseInt(movieId),
        date,
        timeId,
        numberseats
      );
      setSelSeats(result.seats);
      setLayout(result.layout);
      setStep(2);
    } catch (error) {
      console.log(error);
      if (error instanceof ApiError) logout();
      //TODO f api error because of token expiration, must logout and reload
      toast.error(String(error));
    }
  };

  function changeSeats(increment: boolean) {
    setNumberSeats((prev) => {
      if (increment) {
        return prev === MAX_SEATS ? prev : prev + 1;
      } else {
        return prev === 1 ? prev : prev - 1;
      }
    });
  }

  function selectedSeat(row: number, column: number, status: number) {
    // TODO call api to reserve/unsereve a seat
  }

  return (
    <Paper elevation={3} className={classes["reservation-container"]}>
      {/* ------ main title -------- */}
      <Box className={classes["reservation-title"]}>
        <Typography variant="body1" fontWeight="700" color="white">
          {`Hello ${userData?.name}, please select the number of seats and their position`}
        </Typography>
      </Box>
      {/* ------- seats quantity selection -------- */}
      <Box position="relative">
        <Box className={classes["seat-selection"]}>
          <Box>
            <IconButton
              disabled={step !== 1}
              onClick={() => changeSeats(false)}
            >
              <RemoveIcon />
            </IconButton>
          </Box>
          <TextField
            size="small"
            disabled
            value={numberseats}
            slotProps={{
              htmlInput: {
                style: {
                  textAlign: "center",
                  fontWeight: "800",
                  fontSize: "1.2rem",
                  width: "40px",
                },
              },
            }}
          />
          <Box>
            <IconButton disabled={step !== 1} onClick={() => changeSeats(true)}>
              <AddIcon />
            </IconButton>
          </Box>
        </Box>
        <Box
          right="5px"
          top="5px"
          p="3px"
          sx={{ position: { sx: "unset", sm: "absolute" } }}
        >
          <Button
            disabled={step !== 1}
            variant="contained"
            onClick={getSeatsHandler}
          >
            Seats
          </Button>
        </Box>
      </Box>
      <Divider sx={{ mt: "10px", mb: "10px" }} variant="fullWidth" />
      {/* ------- auditoriu seats selection -------- */}
      <Box m="10px">
        <Auditorium layout={layout} onSelectSeat={selectedSeat} />
      </Box>
    </Paper>
  );
};

export default SeatReservationStep;
