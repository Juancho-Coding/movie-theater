import { initializePool, testConnection } from "./db/postgres";
import http from "http";
import { startServer } from "./server";
import { socketioServer } from "./socketServer";
import env from "dotenv";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { createEmailTransporter } from "./utils/nodemailer";
import watchReservations from "./utils/reservationKepper";

dayjs.extend(utc);

(async () => {
  // load secrets as env variables if running locally
  if (process.env.NODE_ENV !== "production") env.config();
  // initialize connection with db
  initializePool();
  // initialize nodemailer transporter
  createEmailTransporter();
  try {
    // test the connection with db
    await testConnection();
    const app = startServer();
    const server = http.createServer(app);
    socketioServer(server);
    const serverPort = process.env.SERVER_PORT || 9000;
    server.listen(serverPort, () => {
      // TODO implement better logging with std.out
      console.log("server started on port " + serverPort);
      // watch for expire reservations
      watchReservations();
    });
  } catch (error) {
    console.log("Error occured");
    console.log(error);
    // TODO implement logging to std.error
  }
})();
