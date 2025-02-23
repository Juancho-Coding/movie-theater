import {
  Box,
  Button,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import classes from "./form.module.css";
import { useState } from "react";

const LoginForm = ({ login, dummyLogin, dismiss }: props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [valid, setValid] = useState(false);

  const changeEmailHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const content = event.target.value;
    setValid(content.length > 0 && password.length > 0);
    setEmail(content);
  };

  const changePasswordHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const content = event.target.value;
    setValid(content.length > 0 && email.length > 0);
    setPassword(content);
  };

  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(email);
    console.log(password);
    login(email, password);
  };

  return (
    <Paper elevation={3} className={classes["paper-container"]}>
      <Box
        component="form"
        className={classes["form-container"]}
        onSubmit={submitHandler}
      >
        <Box className={classes["form-title"]}>
          <Typography variant="body1" fontWeight="700" color="white">
            Please login to reserve the tickets
          </Typography>
        </Box>
        <Box className={classes["form-content"]}>
          <TextField
            id="email"
            size="small"
            label="Email"
            required
            type="email"
            fullWidth
            value={email}
            onChange={changeEmailHandler}
          />
          <TextField
            id="password"
            size="small"
            label="Password"
            required
            type="password"
            fullWidth
            value={password}
            onChange={changePasswordHandler}
          />
        </Box>
        <Box margin="auto" mb="10px">
          <Typography variant="body2">
            {"I dont have an account, "}
            <Button
              variant="text"
              sx={{ textDecoration: "Underline" }}
              onClick={() => {
                dismiss((prev) => !prev);
              }}
            >
              Sign up
            </Button>
          </Typography>
        </Box>
        <Box className={classes["form-options"]}>
          <Button
            type="submit"
            variant="contained"
            sx={{ mr: "10px" }}
            disabled={!valid}
          >
            Login
          </Button>
          <Tooltip title="Dummy login for demostration purposes">
            <Button variant="contained" onClick={dummyLogin}>
              Use dummy Login
            </Button>
          </Tooltip>
        </Box>
      </Box>
    </Paper>
  );
};

interface props {
  login: (email: string, password: string) => void;
  dummyLogin: () => void;
  dismiss: React.Dispatch<React.SetStateAction<boolean>>;
}

export default LoginForm;
