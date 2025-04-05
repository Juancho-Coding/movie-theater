import { Request, Response, NextFunction } from "express";
import {
  validationResponse,
  validationResults,
} from "../utils/validationResult";
import { dbQueryWithClient } from "../db/postgres";
import { demoPayment } from "../utils/demoPayment";

export async function makePayment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // session id of the current user
  const session = parseInt(req.body.session);
  const userId = res.locals.userId;
  const schedule = req.body.schedule as string;
  const cardHolder = req.body.holder as string;
  const cardNumber = req.body.card as string;
  const cardExp = req.body.cardExp as string;
  const cardCode = req.body.cardCVV as string;
  let client = null;
  try {
    client = await dbQueryWithClient();
    //checks for validation error before continuing
    validationResults(req);
    client.query("START TRANSACTION"); // start transaction
    /* ------- start section: validate limit of tickets to reserve and seat -----  */
    // validate the resevations exist for the user and session
    let result = await client.query(
      `SELECT count(*)::int FROM reservations
          WHERE "session" = $1
          AND user_id = $2
          AND schedule_id = $3
          AND status = 'pending'
        `,
      [session, userId, schedule]
    );
    const numberSeats = (result.rows[0] as { count: number })?.count
      ? (result.rows[0].count as number)
      : 0;
    if (numberSeats === 0) {
      // either the session or user dont exist or there are no reservations
      res.status(403).json({
        msg: "The user and session provided are invalid, no reservations available",
      });
      return;
    }
    // Block the reservations from being deleted by expiration while making the payment
    await client.query(
      `UPDATE reservations SET status='processing'
        WHERE "session" = $1
          AND user_id = $2
          AND schedule_id = $3
          `,
      [session, userId, schedule]
    );
    const payResult = await demoPayment(
      cardHolder,
      cardNumber,
      cardExp,
      cardCode
    );
    if (!payResult.error) {
      //payment successful, update the reservations
      await client.query(
        `UPDATE reservations SET status='reserved'
              WHERE "session" = $1
                AND user_id = $2
                AND schedule_id = $3
                `,
        [session, userId, schedule]
      );
      await client.query("commit");
      res.status(200).json({ error: false, msg: payResult.msg });
      return;
    }
    //payment failed, update the reservations
    res.status(200).json({ error: true, msg: payResult.msg });
    await client.query("ROLLBACK");
  } catch (error) {
    if (client !== null) await client.query("ROLLBACK");
    console.log(error);
    // checks if the error was a validation error
    if (validationResponse(error, res)) return;
    res.status(500).json({ error: "Internal error server" });
  } finally {
    if (client !== null) client.release();
  }
}
