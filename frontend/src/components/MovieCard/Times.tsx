import { Box, Chip } from "@mui/material";

const times = ({ time, link }: props) => {
  return (
    <Box>
      {/* TODO  chane text to link for the movie's details*/}
      <Chip color="info" label={time} clickable />
    </Box>
  );
};

interface props {
  time: string;
  link: string;
}

export default times;
