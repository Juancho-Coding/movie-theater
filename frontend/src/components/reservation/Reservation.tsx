import {
  Box,
  Button,
  Card,
  Fade,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";

import classes from "./Reservation.module.css";
import LoginStep from "./LoginStep";
import AuthContext from "../../context/AuthContext";
import SeatReservationStep from "./SeatReservationStep";

const steps = ["Login/Create Account", "Select Seats", "Reserve and pay"];

const Reservation = () => {
  const [activeStep, setActiveStep] = useState(0);
  const { userData } = useContext(AuthContext);

  useEffect(() => {
    if (userData !== null) setActiveStep(1);
  }, [userData]);

  const nextStep = () => {
    setActiveStep((prev) => (prev === 2 ? 2 : prev + 1));
  };

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
      {/* -----------  First step: login or signup ------------- */}
      <Fade
        in={activeStep == 0}
        appear
        unmountOnExit
        timeout={{ appear: 100, enter: 500, exit: 0 }}
      >
        <Box className={classes["step"]}>
          <LoginStep nextStep={nextStep}></LoginStep>
        </Box>
      </Fade>
      {/* -------- second step: number of tickets and seats ---------- */}
      <Fade
        in={activeStep == 1}
        appear
        unmountOnExit
        timeout={{ appear: 100, enter: 500, exit: 0 }}
      >
        <Box className={classes["step"]}>
          <SeatReservationStep></SeatReservationStep>
        </Box>
      </Fade>
      {/* -------- third step: paying and finalizing ------------ */}
      <Fade
        in={activeStep == 2}
        appear
        unmountOnExit
        timeout={{ appear: 100, enter: 500, exit: 0 }}
      >
        <Box sx={{ border: "1px solid red" }}>step3</Box>
      </Fade>
      <Box>Resultado de reserva</Box>
      <Box>
        <Button
          onClick={() => {
            setActiveStep((previous) => {
              if (previous == 2) return 0;
              return previous + 1;
            });
          }}
        >
          sdfdsfsd
        </Button>
      </Box>
    </Card>
  );
};

export default Reservation;
