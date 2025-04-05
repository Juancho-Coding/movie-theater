import {
  Box,
  Button,
  Divider,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useRef, useState } from "react";
import PaymentIcon from "@mui/icons-material/Payment";
import CreditCardIcon from "@mui/icons-material/CreditCard";

import classes from "./PaymentForm.module.css";
import { dinamicImport } from "../../utils/utils";
import { validateCreditCard } from "../../api/paymentApi";

const PaymentForm = ({ onPay, processing }: props) => {
  // start controlled form
  const [name, setName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [code, setCode] = useState("");
  const [expiry, setExpiry] = useState("");
  const [errorName, setErrorName] = useState(false);
  const [ErrorcardNumber, setErrorCardNumber] = useState(false);
  const [errorCode, setErrorCode] = useState(false);
  const [Errorexpiry, setErrorExpiry] = useState(false);
  // end controlled form
  // store the icon used in the card number input
  const [cardIcon, setCardIcon] = useState("none");
  // store timeout id to cancel if multiples inputs
  const timeoutId = useRef<null | NodeJS.Timeout>(null);
  // if any error, disabled pay button
  const disabled =
    errorName ||
    ErrorcardNumber ||
    errorCode ||
    Errorexpiry ||
    !name ||
    !cardNumber ||
    !code ||
    !expiry;

  // handles name change event
  const nammeChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length > 30) return;
    setName(value);
    setErrorName(value.length < 3 && value.length > 0);
  };

  // handles card number change event
  const cardChangeHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // stops timeout if already started
    if (timeoutId.current !== null) {
      clearTimeout(timeoutId.current);
    }
    const value = e.target.value;
    // removes any character different from numbers
    let digits = value.replace(/\D/g, "");
    // prevents longer card numbers
    if (digits.length > 19) return;
    setErrorCardNumber(digits.length < 13 && digits.length > 0);
    // format digits in group of 4
    digits = digits.replace(/(\d{4})/g, "$1-").replace(/-$/, "");
    setCardNumber(digits);
    // dont call api if length is shorter
    if (digits.length < 13) return;
    timeoutId.current = setTimeout(async () => {
      try {
        const result = await validateCreditCard(digits);
        setErrorCardNumber(result.error);
        setCardIcon(result.cardIcon);
      } catch (error) {
        console.log(error);
        setErrorCardNumber(false);
        setCardIcon("none");
      }
    }, 500);
  };

  // handle verification code event
  const codeChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // validates code length and only numbers
    if (value.length > 3) return;
    if (!/\d+/g.test(value) && value !== "") return;
    setCode(value);
    setErrorCode(value.length < 3 && value.length > 0);
  };

  // handles month and year input event
  const formatExpHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let digits = value.replace(/\D/g, "");
    // Ensure the first two digits represent a valid month (01-12)
    if (digits.length >= 2) {
      const month = parseInt(digits.substring(0, 2), 10);
      if (month > 12 || month < 1) {
        digits = "12" + digits.substring(2); // Clamp month to 12 if out of range
      }
    }
    setErrorExpiry(digits.length < 4 && digits.length > 0);
    // Add "/" after the first two digits (month)
    if (digits.length > 2) {
      return setExpiry(`${digits.substring(0, 2)}/${digits.substring(2, 4)}`);
    }
    setExpiry(digits);
  };

  const paymentHandler = async () => {
    if (
      errorName ||
      ErrorcardNumber ||
      errorCode ||
      Errorexpiry ||
      name.length < 3 ||
      !cardNumber ||
      !code ||
      !expiry
    )
      return;
    onPay(name, cardNumber, expiry, code);
  };

  // get the icon for the card number if available
  const icon =
    cardIcon === "none" ? (
      <CreditCardIcon />
    ) : (
      <img src={dinamicImport(cardIcon)} width="20px" height="auto" />
    );

  return (
    <Box>
      <Box>
        <Typography variant="h6">Payment</Typography>
        <Divider variant="fullWidth" />
      </Box>
      <Box mt="10px" mb="15px">
        <Typography>{`Please enter your card details`}</Typography>
      </Box>
      <Box mb="15px">
        <TextField
          fullWidth
          label="Card Holder's Name"
          error={errorName}
          disabled={processing}
          value={name}
          onChange={nammeChangeHandler}
        />
      </Box>
      <Box mb="10px" className={classes["payment-card-container"]}>
        <Box flexGrow={2}>
          <Tooltip title={<WarningMessage options />} arrow>
            <TextField
              fullWidth
              label="Card Number"
              error={ErrorcardNumber}
              disabled={processing}
              value={cardNumber}
              onChange={cardChangeHandler}
              helperText={ErrorcardNumber && "Format: 1234 5678 9012 3456"}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">{icon}</InputAdornment>
                  ),
                },
              }}
            />
          </Tooltip>
        </Box>

        <Box minWidth="15%" maxWidth="20%">
          <Tooltip title={<WarningMessage />} arrow>
            <TextField
              label="Exp"
              error={Errorexpiry}
              disabled={processing}
              value={expiry}
              onChange={formatExpHandler}
              helperText={Errorexpiry && "Format: MM/YY"}
            />
          </Tooltip>
        </Box>
        <Box minWidth="15%" maxWidth="20%">
          <Tooltip title={<WarningMessage />} arrow>
            <TextField
              label="CVV"
              error={errorCode}
              disabled={processing}
              value={code}
              onChange={codeChangeHandler}
              helperText={errorCode && "Format: 123"}
            />
          </Tooltip>
        </Box>
      </Box>

      <Box>
        <Button
          variant="contained"
          disabled={disabled}
          onClick={paymentHandler}
          endIcon={<PaymentIcon />}
          loadingPosition="end"
          loading={processing}
        >
          {!processing ? "Pay Now" : "Processing Payment"}
        </Button>
      </Box>
    </Box>
  );
};

// Helper component to show the warning message as a tooltip
const WarningMessage = ({ options = false }: { options?: boolean }) => {
  return (
    <Box mt="10px" mb="15px">
      <Typography variant="body2">
        Please note that this is a demo payment
        <br />
        DO NOT use your real credit card info.
      </Typography>
      <br />
      {options && (
        <Typography variant="body2">
          Credit card number ending with 0-5 approves the transaction
          <br />
          Credit card number ending with 6-9 denies the transaction
          <br />
        </Typography>
      )}
    </Box>
  );
};

interface props {
  onPay: (holder: string, cardNumber: string, exp: string, cvv: string) => void;
  processing: boolean;
}

export default PaymentForm;
