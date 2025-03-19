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
import {
  getResevationSeats,
  reserveOneSeat,
  unreserveOneSeat,
} from "../../api/reservationApi";
import { useNavigate, useParams } from "react-router-dom";
import { ApiError } from "../../api/apiHelper";
import toast from "react-hot-toast";
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
  // stores the id of the current session
  const [session, setSession] = useState(-1);
  // stores the id of the current schedule
  const [schedule, setSchedule] = useState("");

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
      setNumberSeats(result.seats.length);
      const firstLayout = result.layout.map((row) => [...row]);
      result.seats.forEach((value) => {
        firstLayout[value.row - 1][value.column - 1] = 2;
      });
      setLayout(firstLayout);
      setSession(result.session);
      setSchedule(result.schedule);
      setStep(2);
      if (result.seats.length < numberseats) {
        toast.error(
          `You have already reserved some tickets, only available ${result.seats.length}`
        );
      }
    } catch (error) {
      console.log(error);
      if (error instanceof ApiError) {
        logout();
        setStep(1);
      }
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

  async function selectedSeatHandler(
    row: number,
    column: number,
    status: number
  ) {
    // status=0: available, 1:occupied, 2:pending
    try {
      if (status === 2) {
        // selected seat was reserved previously, proceed to delete reservation
        const result = await unreserveOneSeat(
          userData?.token,
          session,
          row + 1,
          column + 1
        );
        setLayout((prev) => {
          const newLayout = prev.map((row) => [...row]);
          newLayout[result.deletedRow - 1][result.deletedCol - 1] = 0;
          return newLayout;
        });
        setSelSeats((prev) => {
          const newData = [...prev];
          return newData.filter(
            (seat) =>
              seat.row !== result.deletedRow ||
              seat.column !== result.deletedCol
          );
        });
        return;
      }
      if (status === 0) {
        // selected seat will be added, proceed to create reservation
        // only if there is less than the desired seats selected
        if (selSeats.length >= numberseats) return;
        const result = await reserveOneSeat(
          userData?.token,
          session,
          row + 1,
          column + 1,
          schedule
        );
        setLayout((prev) => {
          const newLayout = prev.map((row) => [...row]);
          newLayout[result.row - 1][result.col - 1] = 2;
          return newLayout;
        });
        setSelSeats((prev) => {
          const newSeats = [...prev];
          newSeats.push({ row: result.row, column: result.col });
          return newSeats;
        });
        return;
      }
    } catch (error) {
      console.log(error);
      if (error instanceof ApiError) {
        logout();
        setStep(1);
      }
      toast.error(String(error));
    }
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
        <Auditorium layout={layout} onSelectSeat={selectedSeatHandler} />
      </Box>
    </Paper>
  );
};

export default SeatReservationStep;
