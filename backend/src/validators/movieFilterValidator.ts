import { query } from "express-validator";

/**
 * Validates the date and time query parameters
 */
export const movieFilterValidator = [
  query("date")
    .custom((value) => {
      // checks if the date is in the format YYYY-MM-DD
      const regex = "[0-9]{4}-[0-9]{2}-[0-9]{2}";
      const dateRegex = new RegExp(regex);
      if (!dateRegex.test(value)) {
        throw new Error("Invalid Date");
      }
      // checks if the date is a valid date
      const date = new Date(value);
      if (date.toString() === "Invalid Date") {
        throw new Error("Invalid Date");
      }
      return true;
    })
    .withMessage("Date must be in the format YYYY-MM-DD"),
  query("time")
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
];

/**
 * Validates the movie id is present in the query
 */
export const movieIdValidator = [
  query("id").exists().isNumeric().withMessage("Provide a valid movie id"),
];
