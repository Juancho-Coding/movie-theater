import { Box, Typography } from "@mui/material";
import Seat from "./Seat";
import classes from "./Auditorium.module.css";
import useMediaQuery from "@mui/material/useMediaQuery";

const Auditorium = ({ layout, onSelectSeat }: props) => {
  const smallWidth = useMediaQuery("(max-width: 700px)");
  return (
    <Box
      className={`${classes["auditorium"]} ${
        smallWidth ? classes["auditorium-small"] : ""
      }`}
    >
      <Box className={classes["screen"]}>
        <Typography variant="body1" textAlign="center" color="white">
          Screen
        </Typography>
      </Box>
      <Box className={classes["seats-container"]}>
        {layout.map((row, indexR) => {
          return (
            <Box key={indexR} className={classes["row-container"]}>
              {row.map((value, indexC) => {
                return (
                  <Seat
                    key={`${indexR}${indexC}`}
                    row={indexR}
                    column={indexC}
                    status={value}
                    onSelect={onSelectSeat}
                  />
                );
              })}
            </Box>
          );
        })}
      </Box>
      <Box className={classes.legend}>
        <Seat row={0} column={0} status={0} onSelect={() => {}} />
        <Typography>Available</Typography>
        <Seat row={0} column={0} status={1} onSelect={() => {}} />
        <Typography>Occupied</Typography>
        <Seat row={0} column={0} status={2} onSelect={() => {}} />
        <Typography>Selected</Typography>
      </Box>
    </Box>
  );
};

interface props {
  layout: number[][];
  onSelectSeat: (row: number, column: number, status: number) => void;
}

export default Auditorium;
