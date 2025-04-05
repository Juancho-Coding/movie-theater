import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  useMediaQuery,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { reservationInfo } from "./Reservation";
import { useEffect, useState } from "react";

const PaymentDetails = ({ info, title }: props) => {
  const { pricePerSeat, taxPerSeat, schedule, seats } = info;
  const mobile = useMediaQuery("(max-width:700px)");
  const [expanded, setExpanded] = useState(true);

  const totalPrice = (pricePerSeat + taxPerSeat) * seats.length;

  useEffect(() => {
    setExpanded(!mobile);
  }, [mobile]);

  return (
    <>
      {mobile && (
        <Box padding="10px">
          <Typography component="span">{`🎬 Going to watch: `}</Typography>
          <Typography component="span">{`${title}`}</Typography>
          <Typography component="span">{` on `}</Typography>
          <Typography component="span">{schedule}</Typography>
          <Box mt="10px" mb="15px" display="flex" columnGap="5px">
            <Typography component="span">{`Your seats are:`}</Typography>
            {seats.map((seat) => {
              return (
                <Chip
                  size="small"
                  key={"" + seat.row + "-" + seat.col}
                  label={
                    // seat comes with index-1
                    String.fromCharCode(seat.row - 1 + 65) +
                    " " +
                    seat.col.toString().padStart(2, "0")
                  }
                  color="info"
                  sx={{ marginRight: "10px" }}
                />
              );
            })}
          </Box>
        </Box>
      )}
      {!mobile && (
        <Box>
          <Box>
            <Typography variant="h6">Details</Typography>
            <Divider variant="fullWidth" />
          </Box>
          <Box mt="10px" mb="15px">
            <Typography>{title}</Typography>
          </Box>
          <Box>
            <Typography>Showtime</Typography>
            <Divider variant="fullWidth" />
          </Box>
          <Box mt="10px" mb="15px">
            <Typography>{schedule}</Typography>
          </Box>
          <Box>
            <Typography>Seats</Typography>
            <Divider variant="fullWidth" />
            <Box mt="10px" mb="15px">
              {seats.map((seat) => {
                return (
                  <Chip
                    key={"" + seat.row + "-" + seat.col}
                    label={
                      // seat comes with index-1
                      String.fromCharCode(seat.row - 1 + 65) +
                      " " +
                      seat.col.toString().padStart(2, "0")
                    }
                    color="info"
                    sx={{ marginRight: "10px" }}
                  />
                );
              })}
            </Box>
          </Box>
        </Box>
      )}
      <Box>
        <Accordion
          expanded={expanded}
          onChange={() => setExpanded((prev) => !prev)}
          square={true}
          sx={{ margin: 0, padding: 0 }}
        >
          <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
            <Typography>
              {!expanded ? `Total Price: $ ${totalPrice}` : `Price Details`}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Table sx={{ minWidth: "100%" }}>
              <TableBody>
                <TableRow>
                  <TableCell>Price per Seat</TableCell>
                  <TableCell>{`$ ${pricePerSeat}`}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Tax per Seat</TableCell>
                  <TableCell>{`$ ${taxPerSeat}`}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography>Total</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{`$ ${totalPrice}`}</Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </AccordionDetails>
        </Accordion>
      </Box>
    </>
  );
};

interface props {
  info: reservationInfo;
  title: string;
}

export default PaymentDetails;
