import { Box, Chip, Paper, Typography } from "@mui/material";
import { dinamicImport } from "../../utils/utils";
import { QRCodeSVG } from "qrcode.react";

const Ticket = ({ title, time, seat, price }: props) => {
  return (
    <Paper key={"" + seat.row + seat.col} elevation={3}>
      <Box
        height="100%"
        width="200px"
        bgcolor="#fffae8"
        sx={{ overflowX: "hidden", overflowY: "auto" }}
      >
        <Box width="100%">
          <Typography
            variant="h5"
            bgcolor="secondary.main"
            color="white"
            p="5px"
            textAlign="center"
          >
            🎫 Ticket 🎫
          </Typography>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          rowGap="5px"
          p="6px"
        >
          <Box width="60px" height="auto">
            <img
              width="100%"
              height="100%"
              src={dinamicImport("combo.webp")}
            ></img>
          </Box>
          <Typography
            variant="body2"
            fontSize="1.4rem"
            sx={{
              wordBreak: "break-word",
              overflowWrap: "break-word",
            }}
            textAlign="center"
          >
            {title}
          </Typography>
          <Typography
            sx={{
              wordBreak: "break-word",
              overflowWrap: "break-word",
            }}
            textAlign="center"
          >
            {time}
          </Typography>
          <Box>
            <Typography component="span">Seat </Typography>
            <Chip
              color={"info"}
              label={
                // seat comes with index-1
                String.fromCharCode(seat.row - 1 + 65) +
                " " +
                seat.col.toString().padStart(2, "0")
              }
            />
          </Box>
          <Typography>{`Price: $${price} USD`}</Typography>
          <QRCodeSVG
            value={`${title}${time}${seat.row}${seat.col}`}
            size={100}
          />
        </Box>
        <Box width="100%">
          <Typography
            variant="h5"
            bgcolor="secondary.main"
            color="white"
            p="5px"
            textAlign="center"
          >
            🎫 Ticket 🎫
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

interface props {
  title: string;
  time: string;
  seat: { row: number; col: number };
  price: number;
}

export default Ticket;
