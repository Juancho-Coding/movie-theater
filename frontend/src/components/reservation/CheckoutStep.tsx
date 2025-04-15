import { Box, Paper, Typography } from "@mui/material";

import classes from "./CheckoutStep.module.css";
import PaymentForm from "./PaymentForm";
import { reservationInfo } from "./Reservation";
import { TimeRemaining } from "./TimeRemaining";
import PaymentDetails from "./PaymentDetails";
import ExpiredDialog from "./ExpiredDialog";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteReservation } from "../../api/reservationApi";
import AuthContext from "../../context/AuthContext";
import toast from "react-hot-toast";
import { ApiError } from "../../api/apiHelper";
import { makePayment } from "../../api/paymentApi";

// TODO change for a configuration parameteralld by an api
const MAX_SECONDS = 300;

const CheckoutStep = ({ info, title, nextStep }: props) => {
  const navigate = useNavigate();
  // flag to open dialog when time expired
  const [openDialog, setOpenDialog] = useState(false);
  const { userData, logout } = useContext(AuthContext);
  // store the processing flag for the payment
  const [processing, setProcessing] = useState(false);

  // close the dialog and cancel any reservation if available
  async function closedDialogHandler() {
    setOpenDialog(false);
    await cancelHandler();
  }

  // handles the time expired event
  function timeExpiredHandler() {
    setOpenDialog(true);
  }

  // cancel the current reservation
  async function cancelHandler() {
    if (info.seats.length === 0) {
      navigate("/");
      return;
    }
    try {
      const result = await deleteReservation(userData?.token, info.session);
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

  async function paymentHandler(
    holder: string,
    cardNumber: string,
    exp: string,
    cvv: string
  ) {
    setProcessing(true);
    try {
      const result = await makePayment(
        userData?.token,
        info.session,
        holder,
        cardNumber,
        exp,
        cvv,
        info.schedule
      );
      if (!result.error) {
        // payment ok
        toast.success(result.msg);
        setProcessing(false);
        nextStep();
        return;
      }
      // payment failed
      toast.error(result.msg + ", Please try again");
    } catch (error) {
      console.log(error);
    }
    setProcessing(false);
  }

  return (
    <Paper elevation={3} className={classes["checkout-container"]}>
      <ExpiredDialog open={openDialog} onClose={closedDialogHandler} />
      <Box className={classes["checkout-title"]}>
        <Typography variant="body1" fontWeight="700" color="white">
          {`Let's finish by making the payment`}
        </Typography>
      </Box>
      <TimeRemaining
        maxTime={MAX_SECONDS}
        onTimeFinish={timeExpiredHandler}
        pause={processing}
      />
      <Box className={classes["checkout-content"]}>
        <Box className={classes["checkout-details"]}>
          <PaymentDetails info={info} title={title} />
        </Box>
        <Box border="1px solid #aaaaaa" />
        <Box className={classes["checkout-payment"]}>
          <PaymentForm
            onPay={paymentHandler}
            processing={processing}
            onCancel={cancelHandler}
          />
        </Box>
      </Box>
    </Paper>
  );
};

interface props {
  info: reservationInfo;
  title: string;
  nextStep: () => void;
}

export default CheckoutStep;
