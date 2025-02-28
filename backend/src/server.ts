import express from "express";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";

import routes from "./routes/index";
import errorHandler from "./middlewares/errorHandler";

export function startServer() {
  // create server app
  const prod = process.env.NODE_ENV === "production";
  const app = express();
  // logs traffic depending on the environment vatiable configured
  // when launching the service
  app.use(morgan(prod ? "combined" : "dev"));
  // allow requests with the determined methods
  app.use(
    cors({
      origin: "*",
      methods: ["GET", "PUT", "POST", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );
  // parses body incoming requests
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  // configuration of routes
  app.use("/api/v1", routes);
  app.use(errorHandler);
  return app;
}
