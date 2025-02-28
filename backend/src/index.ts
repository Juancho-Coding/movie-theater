import { initializePool, testConnection } from "./db/postgres";
import { startServer } from "./server";
import env from "dotenv";

(async () => {
  // load secrets as env variables
  env.config();
  // initialize connection with db
  initializePool();
  try {
    // test the connection with db
    await testConnection();
    const app = startServer();
    const serverPort = process.env.PORT || 9001;
    app.listen(serverPort, () => {
      // TODO implement better logging with std.out
      console.log("server started on port " + serverPort);
    });
  } catch (error) {
    console.log("Error occured");
    console.log(error);
    // TODO implement logging to std.error
  }
})();
