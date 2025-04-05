import { Request, Response, NextFunction } from "express";
import {
  validationResponse,
  validationResults,
} from "../utils/validationResult";
import sendEmail from "../utils/nodemailer";
import { dbQuery } from "../db/postgres";

export async function sendTicketEmail(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userId = res.locals.userId!;
  const email = req.body.email;
  const movie = req.body.movie;
  const time = req.body.time;
  const pdf = req.file?.buffer;
  try {
    //checks for validation error before continuing
    validationResults(req);
    const user = await dbQuery(`SELECT name FROM users WHERE userid = $1`, [
      userId,
    ]);
    if (user.rows.length === 0) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Send the PDF to the user's email
    await sendEmail(user.rows[0].name, email, movie, time, pdf);
    res.status(200).json({ msg: "Email sent successfully" });
  } catch (error) {
    console.log(error);
    // checks if the error was a validation error
    if (validationResponse(error, res)) return;
    res.status(500).json({ error: "Internal error server" });
  }
}
