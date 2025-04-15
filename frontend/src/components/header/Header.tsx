import { Box, Button, Typography, useMediaQuery } from "@mui/material";

import classes from "./Header.module.css";
import { dinamicImport } from "../../utils/utils";
import { useContext } from "react";
import context from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

/**
 * Header of the pages
 */
const Header = () => {
  const { userData, logout } = useContext(context);
  const navigate = useNavigate();
  const small = useMediaQuery("(max-width: 500px)");

  const logoutHandler = () => {
    if (userData) {
      logout();
      navigate("/");
    }
  };

  return (
    <Box className={classes["header-container"]}>
      <Box className={classes["header-logo"]}>
        <img src={dinamicImport("logo.webp")} alt="Cinema Logo" />
      </Box>
      <Box>
        <Typography
          variant={small ? "h5" : "h3"}
          color="white"
          fontWeight="800"
          fontFamily="Kanit"
        >
          CineLoop
        </Typography>
      </Box>
      <Box>
        {userData && (
          <Button variant="contained" onClick={logoutHandler}>
            {userData === null ? "Login" : "Logout"}
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default Header;
