import { Box, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";

const color = "white";

const Printing = () => {
  // handle light animation
  const [posLight, setPosLight] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setPosLight((prev) => (prev === 3 ? 1 : prev + 1));
    }, 500);
    return () => clearInterval(interval);
  }, []);
  return (
    <>
      <Typography
        variant="h5"
        color="white"
        fontWeight="700"
        textAlign="center"
      >
        Printing Tickets
      </Typography>
      <Box
        display="flex"
        flexDirection="row"
        gap="5px"
        mt="10px"
        alignItems="center"
      >
        <Box
          borderRadius="50%"
          border="1px solid gray"
          width="10px"
          height="10px"
          bgcolor={posLight === 1 ? "yellow" : color}
        ></Box>
        <Box
          borderRadius="50%"
          border="1px solid gray"
          width="10px"
          height="10px"
          bgcolor={posLight === 2 ? "yellow" : color}
        ></Box>
        <Box
          borderRadius="50%"
          border="1px solid gray"
          width="10px"
          height="10px"
          bgcolor={posLight === 3 ? "yellow" : color}
        ></Box>
        <CircularProgress size="20px" color="secondary" />
      </Box>
    </>
  );
};

export default Printing;
