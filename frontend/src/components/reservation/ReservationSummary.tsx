import { Box, Typography } from "@mui/material";

const ReservationSummary = ({ seats, pricePerSeat, taxPerSeat }: props) => {
  return (
    <Box
      p="10px"
      minHeight="40px"
      sx={{
        backgroundColor: "#EFEFEF",
      }}
    >
      <Typography
        component="span"
        fontWeight="700"
        variant="h5"
        fontSize="1.3rem"
        color="primary"
        mr="10px"
      >
        Reservation Summary
      </Typography>
      <Typography component="span" variant="body1">
        You have reserved
      </Typography>
      <Typography component="span" variant="h6" fontWeight="800">
        {` ${seats.length} ${
          seats.length > 1 || seats.length === 0 ? "seats" : "seat"
        }`}
      </Typography>
      <Typography component="span" variant="body1">
        {`  for a total of `}
      </Typography>
      <Typography component="span" variant="h6" fontWeight="800">
        {` ${seats.length * pricePerSeat + seats.length * taxPerSeat} USD`}
      </Typography>
    </Box>
  );
};

interface props {
  seats: { row: number; column: number }[];
  pricePerSeat: number;
  taxPerSeat: number;
}

export default ReservationSummary;
