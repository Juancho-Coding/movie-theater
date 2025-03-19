import { Request, Response, NextFunction } from "express";
import {
  validationResponse,
  validationResults,
} from "../utils/validationResult";
import { dbQuery, dbQueryWithClient } from "../db/postgres";
import { randomInt, randomUUID } from "crypto";
import dayjs from "dayjs";

export async function generateReservation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const date = req.body.date;
  const time = req.body.time;
  const movieId = req.body.movie;
  let seats = req.body.seats ? parseInt(req.body.seats) : 0;
  const userId = res.locals.userId!;
  try {
    //checks for validation error before continuing
    validationResults(req);
    /*   ---------- start section: validates reservation limit -------------------- */
    let validation = await dbQuery(
      `SELECT count(*)::int FROM reservations
      WHERE user_id = $1`,
      [userId]
    );
    const totalReserved = (validation.rows[0] as { count: number }).count;
    if (totalReserved >= 10) {
      // TODO get limit from another source like a table in DB
      // the user already reserved the max amount of tickets for same movie and schedule
      res.status(404).json({
        msg: "You have reached the limit of tickets reserved for this schedule, choose another one",
      });
      return;
    }
    const available = 10 - totalReserved;
    seats = seats > available ? available : seats;
    /*   ---------- start section: fetching schedules -------------------- */
    // search the db for movies that are scheduled for the date and time
    let result = await dbQuery(
      `SELECT s.id AS "scheduleId", s.price, a.total_seats, a.rows, a.columns, COUNT(r.status) AS reserved
      FROM schedules AS s
      JOIN auditoriums AS a ON s.auditorium_id = a.id
      LEFT JOIN reservations AS r ON s.id = r.schedule_id
      WHERE s.movie_id = $1
      AND s.show_time = $2
      AND s.show_date = $3
      GROUP BY s.id, s.price, a.total_seats, a.rows, a.columns, r.status
      HAVING (COUNT(r.status) + $4) <= total_seats
      ORDER BY reserved ASC
      LIMIT(1)`,
      [movieId, time, date, seats]
    );
    if (result.rows.length === 0) {
      // no schedules were found with enough seats
      res.status(404).json({
        msg: "Not enough seats for the movie, select fewer seats, another show time or come back later to try again",
      });
      return;
    }
    const schedule: {
      scheduleId: string;
      price: number;
      total_seats: number;
      rows: number;
      columns: number;
      reserved: number;
    } = result.rows[0];
    /*   ---------- end section: fetching schedules -------------------- */
    /*   ----- start section: getting seats and reserving them ---------- */
    // search the db for reservations associated with the schedule found
    result = await dbQuery(
      `SELECT seat_row, seat_col, true AS reserved FROM reservations
      WHERE schedule_id = $1
      AND status IN('reserved','pending')
      ORDER BY seat_row ASC, seat_col ASC`,
      [schedule.scheduleId]
    );
    if (result === null) {
      throw new Error("Failed to fetch reservations");
    }
    const reservations = result.rows.map((value) => {
      return { row: value.seat_row, col: value.seat_col };
    });
    // create the auditorium layout
    const auditoriumLayout = createLayout(
      schedule.rows,
      schedule.columns,
      reservations
    );
    // finds the required seats inside the audtorium
    const foundSeats = findSeats(auditoriumLayout, seats);
    if (foundSeats === null) {
      res.status(200).json({
        msg: "Not enough seats for the movie, select fewer seats, another show time or come back later to try again",
      });
      return;
    }
    /*   ----- end section: getting seats and reserving them ---------- */
    /*   --------- start section: storing new reservation ------------- */
    // placeholder to replace values in query
    const placeholder = foundSeats
      .map(
        (_, i) =>
          `($${i * 9 + 1}, $${i * 9 + 2},  $${i * 9 + 3},  $${i * 9 + 4},  $${
            i * 9 + 5
          },  $${i * 9 + 6},  $${i * 9 + 7},  $${i * 9 + 8}, $${i * 9 + 9})`
      )
      .join(", ");
    // get dates to create the reservations
    const currDate = dayjs();
    const createdAt = currDate.format("YYYY-MM-DDTHH:mm:ss");
    const expiresAt = currDate.add(10, "minute").format("YYYY-MM-DDTHH:mm:ss");
    // identify the reservations made at the same time
    const session = randomInt(100000); // TODO Improve to avoid possibility ot get same number over time

    // format the results to fit as an array
    const formattedSeats: (string | number)[] = [];
    foundSeats.forEach((seat) => {
      const uniqueId = randomUUID();
      formattedSeats.push(
        uniqueId,
        schedule.scheduleId,
        res.locals.userId!,
        "pending",
        createdAt,
        expiresAt,
        seat.row,
        seat.column,
        session
      );
    });
    result = await dbQuery(
      `INSERT INTO reservations(id, schedule_id, user_id, status, created_at, expires_at, seat_row, seat_col,session)
      VALUES ${placeholder}
      RETURNING schedule_id`,
      formattedSeats
    );
    /*   ----------- end section: storing new reservation -------------- */
    /*   ----- start section: formatting and sending response --------- */
    // format seats reserved to response the api call
    const scheduleId = result.rows[0].schedule_id;
    result = await dbQuery(
      `SELECT seat_row, seat_col FROM reservations
      WHERE schedule_id = $1
      AND status IN('reserved','pending')
      ORDER BY seat_row ASC, seat_col ASC`,
      [scheduleId]
    );

    const totalSeats = result.rows.map((value) => {
      return { row: value.seat_row, col: value.seat_col };
    });
    // create the auditorium layout
    const newLayout = createLayout(schedule.rows, schedule.columns, totalSeats);
    const response = {
      auditorium: layoutToString(newLayout),
      seats: foundSeats,
      status: true,
      session: session,
      schedule: schedule.scheduleId,
    };
    res.status(200).json(response);
    /*   ----- end section: formatting and sending response --------- */
    return;
  } catch (error) {
    console.log(error);
    // checks if the error was a validation error
    if (validationResponse(error, res)) return;
    res.status(500).json({ error: "Internal error server" });
  }
}

export async function reserveSeat(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const session = parseInt(req.body.session);
  const userId = res.locals.userId;
  const row = parseInt(req.body.row);
  const column = parseInt(req.body.column);
  const schedule: string | undefined = req.body.schedule;
  let client = null;
  try {
    client = await dbQueryWithClient();
    //checks for validation error before continuing
    validationResults(req);
    client.query("START TRANSACTION"); // start transaction
    /* ------- start section: validate limit of tickets to reserve and seat -----  */
    // validate the resevations for single user in a single session don't excede
    // the limit
    let result = await client.query(
      `SELECT schedule_id, count(*)::int FROM reservations
      WHERE "session" = $1
      AND user_id = $2
      GROUP BY schedule_id;
    `,
      [session, userId]
    );
    if (result.rows.length >= 5) {
      // TODO get limit from another source like a table in DB
      // maximum number of tickets reserved for a single movie in the same session
      res.status(403).json({
        msg: "You have exceeded the number of tickets bought for a single movie",
      });
      return;
    }
    if (result.rows.length === 0 && schedule === undefined) {
      // the user doesn't have a session or active reservations and schedule was not provided
      res.status(403).json({
        msg: "You don't have any reservation available",
      });
      return;
    }
    const schedule_id =
      result.rows.length === 0
        ? schedule
        : (result.rows[0] as { schedule_id: string; count: number })
            .schedule_id;
    // validate schedule exists
    let validSchedule = await client.query(
      "SELECT * FROM schedules WHERE id=$1",
      [schedule_id]
    );
    if (validSchedule.rows.length === 0) {
      // the schedule provided is invalid
      res.status(403).json({
        msg: "You don't have any reservation available",
      });
      return;
    }
    // Validate the user still have tickets to reserve for a single schedule
    let result2 = await client.query(
      `SELECT count(*)::int FROM reservations
      WHERE user_id = $1
      AND schedule_id = $2
    `,
      [userId, schedule_id]
    );
    const totalReservations = (<{ count: number }[]>result2.rows)[0].count;
    if (totalReservations >= 10) {
      // TODO get limit from another source like a table in DB
      // the user already reserved all the tickets available for a single movie schedule
      res.status(403).json({
        msg: "You already reserved all your available tickets",
      });
      return;
    }
    // Validate the seat is not already taken
    let result3 = await client.query(
      `SELECT * FROM reservations
      WHERE schedule_id = $1
      AND seat_row = $2
      AND seat_col = $3
    `,
      [schedule_id, row, column]
    );
    if (result3.rows.length > 0) {
      // the seat is already taken
      res.status(403).json({
        msg: "The seat is already taken, try other",
      });
      return;
    }
    // validate the rows and columns are valid in the uditorium
    let result4 = await client.query(
      `SELECT rows, columns FROM schedules AS s
    JOIN auditoriums AS a ON a.id = s.auditorium_id
    WHERE s.id = $1
    `,
      [schedule_id]
    );
    const foundSeatLimit = result4.rows[0] as { rows: number; columns: number };
    if (
      foundSeatLimit === undefined ||
      foundSeatLimit.rows < row ||
      foundSeatLimit.columns < column
    ) {
      // the seat row and column are invalid
      res.status(403).json({
        msg: "The seat doesn't exist",
      });
      return;
    }
    /* ------- end section: validate limit of tickets to reserve and seat -----  */
    /* ------- start section: reserve new seat ---------  */
    const currDate = dayjs();
    const createdAt = currDate.format("YYYY-MM-DDTHH:mm:ss");
    const expiresAt = currDate.add(10, "minute").format("YYYY-MM-DDTHH:mm:ss");
    // store the new reservation
    let result5 = await client.query(
      `INSERT INTO reservations(id, schedule_id, user_id, status, created_at, expires_at, seat_row, seat_col, session)
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING seat_row, seat_col`,
      [
        randomUUID(),
        schedule_id,
        userId,
        "pending",
        createdAt,
        expiresAt,
        row,
        column,
        session,
      ]
    );
    const insertedSeat = result5.rows[0] as {
      seat_row: number;
      seat_col: number;
    };
    res.status(200).json({
      msg: "New seat reserved",
      row: insertedSeat.seat_row,
      col: insertedSeat.seat_col,
    });
    await client.query("commit");
    /* ------- start section: reserve new seat ---------  */
  } catch (error) {
    if (client !== null) await client.query("rollback");
    console.log(error);
    // checks if the error was a validation error
    if (validationResponse(error, res)) return;
    res.status(500).json({ error: "Internal error server" });
  } finally {
    if (client !== null) client.release();
  }
}

export async function deleteSeat(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const session = parseInt(req.params.session);
  const userId = res.locals.userId;
  const row = parseInt(req.params.row);
  const column = parseInt(req.params.column);
  let client = null;
  try {
    client = await dbQueryWithClient();
    //checks for validation error before continuing
    validationResults(req);
    client.query("START TRANSACTION"); // start transaction
    /* ------- start section: validate reservation -----  */
    let result = await client.query(
      `SELECT * FROM reservations
      WHERE "session" = $1
      AND user_id = $2
      AND seat_row = $3
      AND seat_col = $4
    `,
      [session, userId, row, column]
    );
    if (result.rows.length === 0) {
      // there is no reservation for the comb of user and session
      res.status(404).json({
        msg: "There is no reservation available",
      });
      return;
    }
    /* ------- end section: validate reservation -----  */
    /* ------- start section: delete reservation ---------  */
    let result2 = await client.query(
      `DELETE FROM reservations
      WHERE "session" = $1
      AND user_id = $2
      AND seat_row = $3
      AND seat_col = $4`,
      [session, userId, row, column]
    );
    res.status(200).json({
      deletedRow: row,
      deletedCol: column,
    });
    await client.query("commit");
    /* ------- start section: reserve new seat ---------  */
  } catch (error) {
    if (client !== null) await client.query("rollback");
    console.log(error);
    // checks if the error was a validation error
    if (validationResponse(error, res)) return;
    res.status(500).json({ error: "Internal error server" });
  } finally {
    if (client !== null) client.release();
  }
}

/**
 * Generates a layout of the auditorium's seats
 * @param rows number od rows
 * @param cols number of columns
 * @param reserved list of reserved seats
 * @returns
 */
function createLayout(
  rows: number,
  cols: number,
  reserved: { row: number; col: number }[]
): Array<Array<boolean>> {
  let seats = Array.from({ length: rows }, () =>
    Array<boolean>(cols).fill(false)
  );
  reserved.forEach((element) => {
    seats[element.row - 1][element.col - 1] = true;
  });
  return seats;
}

/**
 * Find the seats that are requested
 * @param layout layout of the auditorium
 * @param numberOfSeats seats desired
 * @returns list of object with rows and columns
 */
function findSeats(layout: boolean[][], numberOfSeats: number) {
  /**
   * Search consecutive seats in the specified row
   * @param rowSeats boolean array containing occupied: true, available: false seats
   * @param centerIndex the center of the row
   * @param nSeats quantity of seats to reserve
   * @returns number array with index of the seats reserved or null if no consecutive seats reserved
   */
  function searchConsecutiveSeats(
    rowSeats: boolean[],
    centerIndex: number,
    nSeats: number
  ) {
    let indexRight = rowSeats.indexOf(false, centerIndex);
    while (indexRight !== -1) {
      // found available seat, select seats required
      const seats = rowSeats.slice(indexRight, indexRight + nSeats);
      // search inside the consecutive seats if one is occupied
      const ocIndex = seats.indexOf(true);
      if (seats.length !== nSeats) {
        break; // if array is shorter, no seats available exits inmediately
      }
      if (ocIndex === -1) {
        return Array.from({ length: nSeats }, (_, i) => indexRight + i);
      }
      // no consecutive seats, update index to find seats from the last occupied
      indexRight = rowSeats.indexOf(false, indexRight + ocIndex);
    }

    // search seats to the left
    let indexLeft = rowSeats.lastIndexOf(false, centerIndex);
    while (indexLeft !== -1) {
      // found available seat, select seats required
      const minimum =
        indexLeft - (nSeats - 1) < 0 ? 0 : indexLeft - (nSeats - 1);
      const seats = rowSeats.slice(minimum, indexLeft + 1);
      // search inside the consecutive seats if one is occupied
      const ocIndex = seats.lastIndexOf(true);
      if (seats.length !== nSeats) {
        break; // if array is shorter, no seats available exits inmediately
      }
      if (ocIndex === -1) {
        return Array.from({ length: nSeats }, (_, i) => minimum + i);
      }
      // no consecutive seats, update index to find seats from the last occupied
      indexLeft = rowSeats.indexOf(false, indexLeft - ocIndex);
    }
    return null;
  }

  /**
   * Search non consecutive seats in the specified row
   * @param rowSeats boolean array containing occupied: true, available: false seats
   * @param centerIndex the center of the row
   * @param nSeats quantity of seats to reserve
   * @returns number array with index of the seats reserved or null if no seats available
   */
  function searchNonConsecutiveSeats(rowSeats: boolean[], nSeats: number) {
    const seats = [];
    let nextIndex = rowSeats.indexOf(false);
    while (nextIndex !== -1 && seats.length < nSeats) {
      seats.push(nextIndex);
      nextIndex = rowSeats.indexOf(false, nextIndex + 1);
    }
    return seats;
  }

  let selectedSeats: { row: number; column: number }[] = [];
  /* -------- Search for consecutive seats near center of the rows -------- */
  for (let row = layout.length - 1; row >= 0; row--) {
    // search rows in inverse order
    const seats = layout[row];
    const center = Math.floor(seats.length / 2) - 1;
    // if the center element is true, starts from there, if not, start from the last seat with true
    const lastIndex = seats.lastIndexOf(true, center);
    const centerIndex =
      seats[center] === true ? center : lastIndex === -1 ? center : lastIndex;
    const found = searchConsecutiveSeats(seats, centerIndex, numberOfSeats);
    if (found !== null) {
      found.forEach((element) => {
        selectedSeats.push({ row: row + 1, column: element + 1 });
      });
      break;
    }
  }
  if (selectedSeats.length > 0) {
    return selectedSeats;
  }
  /* -------- No consecutive seats, seats free scattered seats -------- */
  for (let row = layout.length - 1; row >= 0; row--) {
    // search rows in inverse order
    const seats = layout[row];
    const found = searchNonConsecutiveSeats(
      seats,
      numberOfSeats - selectedSeats.length
    );
    if (found !== null) {
      found.forEach((element) => {
        selectedSeats.push({ row: row + 1, column: element + 1 });
      });
      if (numberOfSeats === selectedSeats.length) break;
    }
  }
  if (selectedSeats.length > 0) {
    return selectedSeats;
  }
  return null;
}

/**
 * Convert the auditorium layout to a number per row
 * @param layout array of boolean[][] representing seats, true occupied, false empty
 * @returns array on number per each row
 */
function layoutToString(layout: boolean[][]) {
  return layout.map((value) => {
    return value.map((val) => (val ? "1" : "0")).join("");
  });
}

type ScheduleInfo = {
  shceduleid: string;
  price: number;
  total_seats: number;
  rows: number;
  columns: number;
  reserved: number;
};
