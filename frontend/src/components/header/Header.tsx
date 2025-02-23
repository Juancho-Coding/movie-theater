import { Box, Button, Typography } from "@mui/material";

import classes from "./Header.module.css";
import { dinamicImport } from "../../utils/utils";

/**
 * Header of the pages
 */
const Header = () => {
  return (
    <Box className={classes["header-container"]}>
      <Box className={classes["header-logo"]}>
        <img src={dinamicImport("logo.webp")} alt="Cinema Logo" />
      </Box>
      <Box>
        <Typography variant="h3" color="white" fontWeight="800">
          My cinema
        </Typography>
      </Box>
      <Box>
        {/* TODO: implement login logic for using the page as admon */}
        <Button variant="contained">Login</Button>
      </Box>
    </Box>
  );
};

export default Header;
