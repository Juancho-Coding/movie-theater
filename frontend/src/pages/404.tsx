import { Box, Button } from "@mui/material";
import { dinamicImport } from "../utils/utils";
import { useNavigate } from "react-router-dom";

const ErrorBoundary = () => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        rowGap: "10px",
        backgroundColor: "#591d22",
      }}
    >
      <Box
        position="absolute"
        top="0"
        width="100%"
        sx={{
          background: "linear-gradient(to bottom,rgb(173, 0, 0), #FFFFFF00)",
          padding: "40px",
        }}
      ></Box>
      <Box maxHeight="70%">
        <img src={dinamicImport("404.webp")} width="100%" height="100%"></img>
      </Box>
      <Button
        variant="contained"
        onClick={() => navigate("/", { replace: true })}
      >
        Explore More Movies
      </Button>
    </Box>
  );
};

export default ErrorBoundary;
