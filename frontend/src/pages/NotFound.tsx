import { Box, Button } from "@mui/material";
import { dinamicImport } from "../utils/utils";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
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
        backgroundImage: `url(${dinamicImport("pattern.webp")})`,
      }}
    >
      <Box maxHeight="70%">
        <img
          src={dinamicImport("notfoundimage.webp")}
          width="100%"
          height="100%"
        ></img>
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

export default NotFound;
