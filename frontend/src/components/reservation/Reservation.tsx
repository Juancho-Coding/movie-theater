import {
  Box,
  Card,
  Fade,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { useCallback, useContext, useEffect, useState } from "react";
import { TransitionGroup } from "react-transition-group";

import classes from "./Reservation.module.css";
import LoginStep from "./LoginStep";
import AuthContext from "../../context/AuthContext";
import SeatReservationStep from "./SeatReservationStep";
import CheckoutStep from "./CheckoutStep";
import TicketsStep from "./TicketsStep";

const steps = ["Login/Create Account", "Select Seats", "Reserve and pay"];

export type reservationInfo = {
  pricePerSeat: number;
  taxPerSeat: number;
  session: number;
  time: string;
  schedule: string;
  seats: { row: number; col: number }[];
};

const Reservation = ({ title }: props) => {
  const [activeStep, setActiveStep] = useState(0);
  const [reserveInfo, setReserveInfo] = useState<reservationInfo>({
    pricePerSeat: 0,
    taxPerSeat: 0,
    session: -1,
    time: "",
    schedule: "",
    seats: [],
  });
  const { userData } = useContext(AuthContext);

  useEffect(() => {
    if (userData !== null) setActiveStep(1);
  }, [userData]);

  const nextStep = () => {
    setActiveStep((prev) => (prev === 3 ? 3 : prev + 1));
  };

  const updateSeatsHandler = useCallback(
    (
      seats: { row: number; col: number }[],
      price: number,
      tax: number,
      session: number,
      time: string,
      schedule: string
    ) => {
      setReserveInfo({
        seats: seats,
        pricePerSeat: price,
        taxPerSeat: tax,
        session: session,
        time: time,
        schedule: schedule,
      });
    },
    []
  );

  return (
    <Card className={classes["card_container"]}>
      <Typography
        sx={{
          minHeight: "40px",
          backgroundColor: "#30292F",
          padding: "10px",
          marginBottom: "20px",
        }}
        variant="body1"
        fontWeight="700"
        color="white"
        textAlign="center"
      >
        Reservation
      </Typography>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((element, index) => {
          return (
            <Step key={element} completed={index < activeStep}>
              <StepLabel>{element}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <TransitionGroup>
        {/* -----------  First step: login or signup ------------- */}
        {activeStep == 0 && (
          <Fade key={0} timeout={{ appear: 100, enter: 500, exit: 0 }}>
            <Box className={classes["step"]}>
              <LoginStep nextStep={nextStep}></LoginStep>
            </Box>
          </Fade>
        )}
        {/* -------- second step: number of tickets and seats ---------- */}
        {activeStep == 1 && (
          <Fade key={1} timeout={{ appear: 100, enter: 500, exit: 0 }}>
            <Box className={classes["step"]}>
              <SeatReservationStep
                nextStep={nextStep}
                onUpdateSeats={updateSeatsHandler}
                onLogout={setActiveStep}
              ></SeatReservationStep>
            </Box>
          </Fade>
        )}
        {/* -------- third step: paying and finalizing ------------ */}
        {activeStep == 2 && (
          <Fade key={2} timeout={{ appear: 100, enter: 500, exit: 0 }}>
            <Box className={classes["step"]}>
              <CheckoutStep
                info={reserveInfo}
                title={title}
                nextStep={nextStep}
              ></CheckoutStep>
            </Box>
          </Fade>
        )}
        {/* -------- fourth step: Showing tickets ------------ */}
        {activeStep == 3 && (
          <Fade key={3} timeout={{ appear: 100, enter: 500, exit: 0 }}>
            <Box className={classes["step"]}>
              <TicketsStep title={title} info={reserveInfo}></TicketsStep>
            </Box>
          </Fade>
        )}
      </TransitionGroup>
    </Card>
  );
};

interface props {
  title: string;
}

export default Reservation;
