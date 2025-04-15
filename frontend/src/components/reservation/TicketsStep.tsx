import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Fade,
  Paper,
  Slide,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { jsPDF } from "jspdf";
import { toPng } from "html-to-image";

import LocalMoviesIcon from "@mui/icons-material/LocalMovies";
import EmailIcon from "@mui/icons-material/Email";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import classes from "./TicketsStep.module.css";
import Confeti from "../tickets/Confetti";
import { useContext, useEffect, useRef, useState } from "react";
import { dinamicImport } from "../../utils/utils";
import Printing from "../tickets/Printing";
import Ticket from "../tickets/Ticket";
import { reservationInfo } from "./Reservation";
import toast from "react-hot-toast";
import AuthContext from "../../context/AuthContext";
import { sendEmailTickets } from "../../api/paymentApi";
import { useNavigate } from "react-router-dom";

const TicketsStep = ({ title, info }: props) => {
  // flag to stop confetti
  const [show, setShow] = useState(true);
  const [hideConfeti, setHideConfeti] = useState(false);
  const ref = useRef(null);
  // flag to show the ticket message
  const [printTickets, setPrintTickets] = useState(true);
  // flag printing animation finished
  const [animation, setAnimation] = useState(true);
  // stores the rference of the ticket display
  const ticketRefs = useRef<(HTMLElement | null)[]>([]);
  // user information
  const { userData } = useContext(AuthContext);
  const navigate = useNavigate();
  const small = useMediaQuery("(max-width: 700px)");

  // stops the confetti after 15 seconds
  // and hides the confetti after 2 seconds
  useEffect(() => {
    setTimeout(() => {
      setShow(false);
      setTimeout(() => {
        setHideConfeti(true);
      }, 2000);
    }, 15000);
  }, []);

  // hides animations of printing tickets
  useEffect(() => {
    if (printTickets) return;
    setTimeout(() => {
      setAnimation(false);
    }, 5000);
  }, [printTickets]);

  const generatePDF = async (getBlob: boolean) => {
    if (!ticketRefs.current.every((val) => val !== null)) return null;
    try {
      const pdf = new jsPDF({ orientation: "landscape", unit: "px" });
      let w = 10;
      for (let i = 0; i < ticketRefs.current.length; i++) {
        const image = await toPng(ticketRefs.current[i], { cacheBust: true });
        const ratio =
          ticketRefs.current[i]?.offsetHeight /
          ticketRefs.current[i]?.offsetWidth;
        pdf.addImage(image, "PNG", w, 10, 100, 100 * ratio);
        w = w + 110;
      }
      if (getBlob) return pdf.output("blob");
      pdf.save("Tickets.pdf");
      return null;
    } catch (error) {
      console.log(error);
      toast.error("An error ocurred generating PDF, try again later");
      return null;
    }
  };

  const handleEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email")?.toString();
    const blob = await generatePDF(true);
    if (email === undefined || email === "") {
      toast.error("Please enter a valid email address");
      return;
    }
    if (blob === null) return;
    try {
      const result = await sendEmailTickets(
        userData?.token,
        email,
        title,
        info.time,
        blob
      );
      toast.success(result);
    } catch (error) {
      console.log(error);
      toast.error("An error ocurred sending email, try again later");
    }
  };

  return (
    <Paper elevation={3} className={classes["tickets-container"]}>
      <Box className={classes["tickets-title"]}>
        <Typography
          variant="body1"
          fontWeight="700"
          color="white"
          textAlign="center"
        >
          {`🎥🎥 Let's go to the movies 🎥🎥`}
        </Typography>
      </Box>
      {/* Effect of confetti with popcron and beveages */}
      {!hideConfeti && <Confeti im="pop.png" pieces={show ? 50 : 0} />}
      {!hideConfeti && <Confeti im="food.png" size={3} pieces={show ? 5 : 0} />}
      <Box
        className={`${classes["tickets-content"]} ${
          printTickets || !animation ? "" : classes["tickets-content-active"]
        }`}
      >
        {/* shows the message to print tickets and the printing image */}
        <Fade in={animation} unmountOnExit>
          <Box
            className={`${classes["ticket-message"]} ${
              printTickets ? "" : classes["ticket-message-active"]
            }`}
          >
            <Card sx={{ width: "100%", height: "100%" }}>
              <Box
                className={`${classes["ticket-message-title"]} ${
                  printTickets ? "" : classes["ticket-message-title-active"]
                }`}
              >
                {printTickets && (
                  <Typography
                    variant="h5"
                    color="white"
                    fontWeight="700"
                    textAlign="center"
                  >
                    Payment Successful
                  </Typography>
                )}
                {!printTickets && <Printing />}
              </Box>
              {printTickets && (
                <>
                  <Box p="10px 0 10px 0" display="flex" justifyContent="center">
                    <CardMedia
                      component="img"
                      sx={{ width: "50%" }}
                      image={dinamicImport("combo.webp")}
                    ></CardMedia>
                  </Box>
                  <CardContent sx={{ textAlign: "center" }}>
                    <Typography>Let's get your tickets </Typography>
                    <Box mb="10px">
                      <Button
                        variant="contained"
                        color="warning"
                        onClick={() => {
                          setPrintTickets((a) => {
                            return !a;
                          });
                        }}
                      >
                        Print My Tickets 🖨️
                      </Button>
                    </Box>
                  </CardContent>
                </>
              )}
            </Card>
          </Box>
        </Fade>
        {/* Shows the list of tickets */}
        {!printTickets && (
          <Box
            className={`${classes["ticket-display"]} ${
              animation ? "" : classes["ticket-display-active"]
            }`}
          >
            {info.seats.map((seat, i) => {
              return (
                <Slide
                  container={ref?.current}
                  direction="right"
                  in
                  timeout={{ enter: 3000 }}
                >
                  <Box
                    ref={(el: HTMLElement | null) => {
                      ticketRefs.current[i] = el;
                    }}
                  >
                    <Ticket
                      title={title}
                      time={info.time}
                      seat={seat}
                      price={info.pricePerSeat}
                    ></Ticket>
                  </Box>
                </Slide>
              );
            })}
          </Box>
        )}
      </Box>
      {!animation && (
        <>
          <Box className={classes["buttons-container"]}>
            <Button
              variant="contained"
              onClick={() => generatePDF(false)}
              endIcon={<PictureAsPdfIcon />}
            >
              Get PDF
            </Button>
            <form
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "80%",
              }}
              onSubmit={handleEmail}
            >
              <TextField
                fullWidth
                id="email"
                name="email"
                type="email"
                size="small"
                required
                margin="none"
                placeholder="Send tickets by email"
              />
              <Button
                type="submit"
                variant="contained"
                sx={{ ml: "5px" }}
                endIcon={<EmailIcon sx={{ mr: "5px" }} />}
              >
                Send
              </Button>
            </form>
            {!small && (
              <Box>
                <Button
                  variant="contained"
                  onClick={() => navigate("/")}
                  endIcon={<LocalMoviesIcon />}
                >
                  Watch more
                  <br />
                  movies
                </Button>
              </Box>
            )}
          </Box>
          {small && (
            <Box width="100%" sx={{ textAlign: "center" }}>
              <Button
                variant="contained"
                onClick={() => navigate("/")}
                endIcon={<LocalMoviesIcon />}
              >
                Watch more
                <br />
                movies
              </Button>
            </Box>
          )}
        </>
      )}
    </Paper>
  );
};

interface props {
  info: reservationInfo;
  title: string;
}

export default TicketsStep;
