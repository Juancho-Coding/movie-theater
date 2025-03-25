import { Box } from "@mui/material";

import classes from "./Auditorium.module.css";
import { useCallback, useRef, useState } from "react";

const Seat = ({ row, column, status, onSelect }: props) => {
  // store the flag for a debounce functionality
  const [isDisabled, setIsDisabled] = useState(false);
  // store the timeout ref for the debouncer
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const classStatus =
    status === 0
      ? "seat-available"
      : status === 1
      ? "seat-occupied"
      : "seat-selected";

  // handle when click on the seat
  const clickHandler = useCallback(() => {
    // seat is disabled or debounce is working
    if (status === 1 || isDisabled) return;
    // start debouncer
    setIsDisabled(true);
    onSelect(row, column, status);
    // debouncer timeout
    const timeout = setTimeout(() => {
      setIsDisabled(false);
    }, 1000);
    timeoutRef.current = timeout;
    return () => {
      // cancel the timeout
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isDisabled, status, row, column, onSelect]);

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
