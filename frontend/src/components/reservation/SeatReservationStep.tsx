import {
  Box,
  Button,
  Divider,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  getResevationSeats,
  reserveOneSeat,
  unreserveOneSeat,
  deleteReservation,
} from "../../api/reservationApi";

import classes from "./SeatReservationStep.module.css";
import AuthContext from "../../context/AuthContext";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { ApiError } from "../../api/apiHelper";
import Auditorium from "./Auditorium";
import { useSocket } from "../../hooks/useSocket";
import { TimeRemaining } from "./TimeRemaining";
import ExpiredDialog from "./ExpiredDialog";
import dayjs from "dayjs";
import ReservationSummary from "./ReservationSummary";

// TODO change for a configuration parameteralld by an api
const MAX_SEATS = 5;

// TODO change for a configuration parameteralld by an api
const MAX_SECONDS = 300;

const SeatReservationStep = ({ nextStep, onUpdateSeats, onLogout }: props) => {
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
  // store the step number to modify UI
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
  // stores the price of the seat
  const [price, setPrice] = useState(0);
  // stores the flag to start receiving messages
  const [flag, setFlag] = useState(false);
  // hook to interact with the socket and the messages
  const [isConnected, socketId, getMessages] = useSocket();
  // flag confirmation of checkout
  const [confirmation, setConfirmation] = useState(false);
  // flag to open dialog when time expired
  const [openDialog, setOpenDialog] = useState(false);

  // Validates the movies parameters exists before sending a reservation
  useEffect(() => {
    if (movieId === undefined || timeId === undefined || date === undefined) {
      // TODO Navigate to a page showing an error message instead of main page
      navigate("/");
    }
  }, [movieId, timeId, date, navigate]);

  // updates the layout when a message from socketio is received
  useEffect(() => {
    if (!flag) return;
    const messages = getMessages();
    if (messages.length === 0) return;
    setLayout((prev) => {
      const newLayout = prev.map((row) => [...row]);
      updateLayout(newLayout, selSeats, messages);
      return newLayout;
    });
  }, [flag, selSeats, getMessages]);

  // reset the checkout button when seats are selected
  useEffect(() => setConfirmation(false), [selSeats]);

  useEffect(() => {
    const seats = selSeats.map((s) => {
      return { row: s.row, col: s.column };
    });
    onUpdateSeats(
      seats,
      price,
      0,
      session,
      `${dayjs(date).format("MMMM DD of YYYY")} at ${timeId}`,
      schedule
    );
  }, [selSeats, price, onUpdateSeats, session, schedule, date, timeId]);

  // try to make the initial reservation
  const getSeatsHandler = async () => {
    try {
      const result = await getResevationSeats(
        userData?.token,
        parseInt(movieId),
        date,
        timeId,
        numberseats,
        isConnected ? socketId! : ""
      );
      // update list of selected seats
      setSelSeats(result.seats);
      // depending on the number of seats available updates the maximum number of seats
      setNumberSeats(result.seats.length);
      // updates the layout
      const firstLayout = result.layout.map((row) => [...row]);
      updateLayout(firstLayout, result.seats);
      setLayout(firstLayout);
      // strores the current session id
      setSession(result.session);
      // stores the schedule id
      setSchedule(result.schedule);
      // stores the price of the seat
      setPrice(result.price);
      // proceeds to show the auditorium
      setStep(2);
      // prepare to receive messages
      setFlag(true);
      if (result.seats.length < numberseats) {
        toast.error(
          `You have already reserved some tickets, only available ${result.seats.length}`
        );
      }
      // TODO receive tax value
    } catch (error) {
      console.log(error);
      if (error instanceof ApiError) {
        logout();
        onLogout(0); //state back to login
        toast.error(error.msg);
        return;
      }
      toast.error(String(error));
    }
  };

  // handles the increment/decrement of desired seats
  function changeSeats(increment: boolean) {
    setNumberSeats((prev) => {
      if (increment) {
        return prev === MAX_SEATS ? prev : prev + 1;
      } else {
        return prev === 1 ? prev : prev - 1;
      }
    });
  }

  // Handle the selection of a seat to reserve or unreserve
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
        // updates layout
        setLayout((prev) => {
          const newLayout = prev.map((row) => [...row]);
          //newLayout[result.deletedRow - 1][result.deletedCol - 1] = 0;
          updateLayout(newLayout, selSeats, {
            row: result.deletedRow,
            col: result.deletedCol,
            status: 0,
          });
          return newLayout;
        });
        // removes seat from list of selected seats
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
        // updates layout with new seat
        setLayout((prev) => {
          const newLayout = prev.map((row) => [...row]);
          updateLayout(newLayout, selSeats, {
            row: result.row,
            col: result.col,
            status: 2,
          });
          return newLayout;
        });
        // add new seat to list of selected seats
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
        onLogout(0); // state back to login
        toast.error(error.msg);
        return;
      }
      toast.error(String(error));
    }
  }

  // verify the seats before procedding to checkout
  function checkoutHandler() {
    if (selSeats.length === 0) {
      toast.error("There are no seats reserved");
      setConfirmation(false);
      return;
    }
    if (selSeats.length < numberseats) {
      toast("You have reserved less seats than those desired");
      setConfirmation(true);
      return;
    }
    continueHandler();
  }

  // cancel the current reservation
  async function cancelHandler() {
    if (selSeats.length === 0) {
      navigate("/");
      return;
    }
    try {
      const result = await deleteReservation(userData?.token, session);
      toast.success(result.msg);
    } catch (error) {
      console.log(error);
      if (error instanceof ApiError) {
        logout();
      }
      toast.error(String(error));
    }
    navigate("/");
  }

  // handles the time expired event
  function timeExpiredHandler() {
    setOpenDialog(true);
  }

  // close the dialog and cancel any reservation if available
  async function closedDialogHandler() {
    setOpenDialog(false);
    await cancelHandler();
  }

  function continueHandler() {
    nextStep();
  }

  return (
    <Paper elevation={3} className={classes["reservation-container"]}>
      <ExpiredDialog open={openDialog} onClose={closedDialogHandler} />
      {/* ------ main title -------- */}
      <Box className={classes["reservation-title"]}>
        <Typography variant="body1" fontWeight="700" color="white">
          {`Hey, ${userData?.name}! Please choose the number of seats and pick your preferred spots for `}
          <Typography
            component="span"
            variant="body1"
            fontWeight="700"
            color="white"
            fontSize="1.1rem"
          >
            {`${dayjs(date).format("MMMM DD of YYYY")} at ${timeId}`}
          </Typography>
        </Typography>
      </Box>
      {/* ------- seats quantity selection -------- */}
      <Box>
        <Box className={classes["seat-selection-container"]}>
          <Box className={classes["seat-selection-buttons"]}>
            <Box>
              <Button variant="contained" onClick={cancelHandler}>
                Cancel
              </Button>
            </Box>
            <Box>
              <Button
                disabled={step !== 1}
                variant="contained"
                onClick={getSeatsHandler}
              >
                Seats
              </Button>
            </Box>
          </Box>
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
              <IconButton
                disabled={step !== 1}
                onClick={() => changeSeats(true)}
              >
                <AddIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Box>
      {/* ------- END seats quantity selection -------- */}
      {/* ------- START time keeping section -------- */}
      {step !== 1 && (
        <>
          <Divider sx={{ mt: "10px", mb: "10px" }} variant="fullWidth" />

          <Box>
            <TimeRemaining
              maxTime={MAX_SECONDS}
              onTimeFinish={timeExpiredHandler}
            ></TimeRemaining>
          </Box>
        </>
      )}
      {/* ------- END time keeping section -------- */}
      {/* ------- START auditorium seats selection -------- */}

      {step !== 1 && (
        <Box>
          <Box m="10px">
            <Auditorium layout={layout} onSelectSeat={selectedSeatHandler} />
          </Box>
          <Box>
            {!confirmation && step !== 1 && (
              <Box display="flex" justifyContent="center" mb="10px">
                <Button variant="contained" onClick={checkoutHandler}>
                  Proceed to checkout
                </Button>
              </Box>
            )}
            {confirmation && (
              <Box display="flex" justifyContent="center" columnGap="10px">
                <Box display="flex" justifyContent="center" mb="10px">
                  <Button
                    variant="contained"
                    onClick={() => setConfirmation(false)}
                  >
                    Cancel
                  </Button>
                </Box>

                <Box display="flex" justifyContent="center" mb="10px">
                  <Button variant="contained" onClick={checkoutHandler}>
                    Proceed
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      )}
      <ReservationSummary
        seats={selSeats}
        pricePerSeat={price}
        taxPerSeat={0}
      />
    </Paper>
  );
};

/**
 * updates the layout according to the new or removed seats and the messages received from socket
 * @param layout
 * @param SelectedSeats
 * @param receivedMsg
 * @returns
 */
function updateLayout(
  layout: number[][],
  SelectedSeats: { row: number; column: number }[],
  receivedMsg?:
    | { row: number; col: number; status: boolean }[]
    | { row: number; col: number; status: number }
) {
  // check if an update was received
  if (receivedMsg) {
    // an updated was received either by the user or other users
    if (Array.isArray(receivedMsg)) {
      receivedMsg.forEach((value) => {
        // to avoid disabling a seat the user selected because of the message received
        // by the socket, the messages are filtered against the current selected seats
        if (value.status === false) {
          layout[value.row - 1][value.col - 1] = value.status ? 1 : 0;
          return;
        }
        const exists =
          SelectedSeats.findIndex(
            (seat) => seat.row === value.row && seat.column === value.col
          ) >= 0;
        if (exists) return;
        const seatValue = layout[value.row - 1][value.col - 1];
        if (seatValue !== 0) return;
        layout[value.row - 1][value.col - 1] = value.status ? 1 : 0;
      });
    } else {
      // an update from the user add or remove one reservation
      // documentar
      // remove seat, must update layout with selected seats first
      // then update the seat removed
      SelectedSeats.forEach((value) => {
        layout[value.row - 1][value.column - 1] = 2;
      });
      layout[receivedMsg.row - 1][receivedMsg.col - 1] = receivedMsg.status;
      return;
    }
  } else {
    // just update the layout with the selected seats
    SelectedSeats.forEach((value) => {
      layout[value.row - 1][value.column - 1] = 2;
    });
  }
}

interface props {
  onLogout: React.Dispatch<React.SetStateAction<number>>;
  nextStep: () => void;
  onUpdateSeats: (
    seats: { row: number; col: number }[],
    price: number,
    tax: number,
    session: number,
    time: string,
    schedule: string
  ) => void;
}

export default SeatReservationStep;
