import { Box, LinearProgress, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";

export const TimeRemaining = ({
  maxTime,
  onTimeFinish,
  pause = false,
}: Props) => {
  // store the seconds remaining
  const [secRemaining, setSecRemaining] = useState<number>(maxTime);
  // store the reference of the interval
  const interval = useRef<NodeJS.Timeout | null>(null);

  // create the interval function
  useEffect(() => {
    if (pause) return;
    const timer = setInterval(() => {
      setSecRemaining((prev) => {
        const newRemaining = prev - 1 <= 0 ? 0 : prev - 1;
        if (newRemaining === 0) {
          // call the function when the time finishes
          onTimeFinish();
          if (interval.current) {
            clearInterval(interval.current);
            interval.current = null;
          }
        }
        return newRemaining;
      });
    }, 1000);
    interval.current = timer;
    return () => {
      if (interval.current) {
        clearInterval(interval.current);
        interval.current = null;
      }
    };
  }, [onTimeFinish, pause]);

  // chance color depending on the time remaining
  const color =
    secRemaining < maxTime * 0.2
      ? "error"
      : secRemaining < maxTime * 0.5
      ? "warning"
      : "success";

  return (
    <Box>
      <LinearProgress
        sx={{ height: "5px" }}
        variant="determinate"
        value={(secRemaining / maxTime) * 100}
        color={color}
      />
      <Typography textAlign="center">
        {`You have ${Math.floor(secRemaining / 60)}:${(secRemaining % 60)
          .toString()
          .padStart(2, "0")} remaining to reserve the seats`}
      </Typography>
    </Box>
  );
};

interface Props {
  maxTime: number;
  onTimeFinish: () => void;
  pause?: boolean;
}
