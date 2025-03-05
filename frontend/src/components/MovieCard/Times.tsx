import { Box, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Times = ({ time, link }: props) => {
  const navigate = useNavigate();
  return (
    <Box>
      <Chip
        color="info"
        label={time}
        onClick={() => {
          navigate("/reservation/" + link);
        }}
      />
    </Box>
  );
};

interface props {
  time: string;
  link: string;
}

export default Times;
