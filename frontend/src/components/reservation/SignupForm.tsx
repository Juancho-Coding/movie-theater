import { Box, Button, Paper, TextField, Typography } from "@mui/material";

import classes from "./form.module.css";
import { useState } from "react";
import { passwordValidator } from "../../utils/utils";

const SignupForm = ({ signup, dismiss }: props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  // handle error in validation of password1
  const [errorPass1, setErrorPass1] = useState<{
    error: boolean;
    msg: string;
  } | null>(null);
  // handle error in validation of password2
  const [errorPass2, setErrorPass2] = useState<{
    error: boolean;
    msg: string;
  } | null>(null);
  // indicator that all fields are valid
  const [valid, setValid] = useState(false);

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

  // validate the data from the form
  const validateForm = (
    name: string,
    email: string,
    password: string,
    password2: string
  ) => {
    console.log(passwordValidator(password));

    if (passwordValidator(password)) {
      setErrorPass1({ error: false, msg: "" });
    } else {
      setErrorPass1({
        error: true,
        msg: "The password must contain at least one number, one lowercase letter, one uppercase letter and one special character",
      });
    }
    if (passwordValidator(password2)) {
      setErrorPass2({ error: false, msg: "" });
    } else {
      setErrorPass2({
        error: true,
        msg: "The password must contain at least one number, one lowercase letter, one uppercase letter and one special character",
      });
    }
    if (password !== password2) {
      setErrorPass2({
        error: true,
        msg: "The passwords must match",
      });
    }
    setValid(
      name.length > 0 &&
        email.length > 0 &&
        passwordValidator(password) &&
        passwordValidator(password2) &&
        password === password2
    );
  };

  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
            error={errorPass1 ? errorPass1.error : false}
            helperText={errorPass1 ? errorPass1.msg : ""}
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
            error={errorPass2 ? errorPass2.error : false}
            helperText={errorPass2 ? errorPass2.msg : ""}
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
