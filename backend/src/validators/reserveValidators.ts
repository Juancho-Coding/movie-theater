import dayjs from "dayjs";
import { body } from "express-validator";

export const reserveValidator = [
  body("date")
    .exists()
    .withMessage("The date is missing")
    .custom((date: string) => {
      return dayjs(date).isValid();
    }),
  body("time")
    .exists()
    .withMessage("The time is missing")
    .custom((value: string) => {
      // checks if the time is in the format HH:MM
      const regex = "[0-9]{2}:[0-9]{2}";
      const timeRegex = new RegExp(regex);
      if (!timeRegex.test(value)) {
        throw new Error("Invalid Time");
      }
      // checks if the time is a valid time
      const [hours, minutes] = value.split(":").map(Number);
      if (hours > 23 || minutes > 59) {
        throw new Error("Invalid Time");
      }
      return true;
    })
    .withMessage("Time must be in the format HH:MM"),
  body("seats")
    .exists()
    .withMessage("The number of seats is missing")
    .isNumeric({ no_symbols: true })
    .withMessage("Seats format is invalid"),
];
