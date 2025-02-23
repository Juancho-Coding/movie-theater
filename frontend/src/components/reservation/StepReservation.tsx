import {
  Box,
  Button,
  Card,
  Fade,
  Step,
  StepLabel,
  Stepper,
} from "@mui/material";
import { useState } from "react";
import LoginStep from "./LoginStep";

const steps = ["Login/Create Account", "Select Seats", "Reserve and pay"];

const StepReservation = () => {
  const [activeStep, setActiveStep] = useState(0);

  const nextStep = () => {
    setActiveStep((prev) => (prev === 2 ? 2 : prev + 1));
  };

  return (
    <Card
      sx={{
        m: "5px",
        width: "100%",
        height: "100%",
        pt: "20px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((element, index) => {
          return (
            <Step key={element} completed={index < activeStep}>
              <StepLabel>{element}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <Fade
        in={activeStep == 0}
        appear
        unmountOnExit
        timeout={{ appear: 100, enter: 500, exit: 0 }}
      >
        <Box
          sx={{
            paddingTop: "10%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <LoginStep nextStep={nextStep}></LoginStep>
        </Box>
      </Fade>
      <Fade
        in={activeStep == 1}
        appear
        unmountOnExit
        timeout={{ appear: 100, enter: 500, exit: 0 }}
      >
        <Box sx={{ border: "1px solid red" }}>step2</Box>
      </Fade>
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

export default StepReservation;
