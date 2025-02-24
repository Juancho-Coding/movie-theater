import { Box, Button, Paper, TextField, Typography } from "@mui/material";

import classes from "./form.module.css";
import { useState } from "react";

const SignupForm = ({ signup, dismiss }: props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [valid, setValid] = useState(false);

  const error =
    password.length > 0 && password2.length > 0 && password !== password2;

  const changeNameHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const content = event.target.value;
    setName(content);
    validateForm(content, email, password, password2);
  };

  const changeEmailHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const content = event.target.value;
    setEmail(content);
    validateForm(name, content, password, password2);
  };

  const changePasswordHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const content = event.target.value;
    setPassword(content);
    validateForm(name, email, content, password2);
  };

  const changePassword2Handler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const content = event.target.value;
    setPassword2(content);
    validateForm(name, email, password, content);
  };

  const validateForm = (
    name: string,
    email: string,
    password: string,
    password2: string
  ) => {
    setValid(
      name.length > 0 &&
        email.length > 0 &&
        password.length > 0 &&
        password2.length > 0
    );
  };

  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO Validate length and structure of password
    signup(name, email, password);
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
            Please fill the information to Sign up
          </Typography>
        </Box>
        <Box className={classes["form-content"]}>
          <TextField
            id="name"
            size="small"
            label="Full Name"
            required
            fullWidth
            value={name}
            onChange={changeNameHandler}
          />
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
            id="password1"
            size="small"
            label="Password"
            required
            type="password"
            fullWidth
            value={password}
            onChange={changePasswordHandler}
            error={error}
            helperText={error ? "The password doesn't match" : ""}
          />
          <TextField
            id="password2"
            size="small"
            label="Repeat Password"
            required
            type="password"
            fullWidth
            value={password2}
            onChange={changePassword2Handler}
            error={error}
            helperText={error ? "The password doesn't match" : ""}
          />
        </Box>
        <Box className={classes["form-alternative-option"]}>
          <Typography variant="body2">
            {"I already have an account, "}
            <Button
              variant="text"
              sx={{ textDecoration: "Underline" }}
              onClick={() => dismiss((prev) => !prev)}
            >
              Login
            </Button>
          </Typography>
        </Box>
        <Box className={classes["form-options"]}>
          <Button type="submit" variant="contained" disabled={!valid}>
            Sign Up
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

interface props {
  signup: (name: string, email: string, password: string) => void;
  dismiss: React.Dispatch<React.SetStateAction<boolean>>;
}

export default SignupForm;
