import { Box } from "@mui/material";

import classes from "./Auditorium.module.css";

const Seat = ({ row, column, status, onSelect }: props) => {
  const classStatus =
    status === 0
      ? "seat-available"
      : status === 1
      ? "seat-occupied"
      : "seat-selected";

  const clickHandler = () => {
    if (status === 1) return;
    onSelect(row, column, status);
  };

  return (
    <Box
      className={`${classes.seats} ${classes[classStatus]}`}
      onClick={clickHandler}
    >
      {` ${String.fromCharCode(row + 65)}`}
      <br />
      {` ${(column + 1).toString().padStart(2, "0")}`}
    </Box>
  );
};

interface props {
  row: number;
  column: number;
  status: number;
  onSelect: (row: number, column: number, status: number) => void;
}

export default Seat;
