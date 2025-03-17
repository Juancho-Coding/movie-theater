import { Box, Typography } from "@mui/material";
import Seat from "./Seat";
import classes from "./Auditorium.module.css";

const Auditorium = ({ layout, onSelectSeat }: props) => {
  return (
    <Box className={classes["auditorium"]}>
      <Box className={classes["screen"]}>
        <Typography variant="body1" textAlign="center" color="white">
          Screen
        </Typography>
      </Box>
      <Box className={classes["seats-container"]}>
        {layout.map((row, indexR) => {
          return (
            <Box className={classes["row-container"]}>
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
    </Box>
  );
};

interface props {
  layout: number[][];
  onSelectSeat: (row: number, column: number, status: number) => void;
}

export default Auditorium;
