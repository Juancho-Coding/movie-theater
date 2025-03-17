import { Request, Response, NextFunction } from "express";
import {
  validationResponse,
  validationResults,
} from "../utils/validationResult";
import { dbQuery } from "../db/postgres";
import { randomUUID } from "crypto";
import dayjs from "dayjs";

export async function generateReservation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const date = req.body.date;
  const time = req.body.time;
  const movieId = req.body.movie;
  const seats = req.body.seats as string;
  res.locals.userId = "17360586-2cca-460d-ac66-bb000d8fef9f";
  try {
    //checks for validation error before continuing
    validationResults(req);
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
      res.status(200).json({
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
    const foundSeats = findSeats(auditoriumLayout, parseInt(seats));
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
          `($${i * 8 + 1}, $${i * 8 + 2},  $${i * 8 + 3},  $${i * 8 + 4},  $${
            i * 8 + 5
          },  $${i * 8 + 6},  $${i * 8 + 7},  $${i * 8 + 8})`
      )
      .join(", ");
    // get dates to create the reservations
    const currDate = dayjs();
    const createdAt = currDate.format("YYYY-MM-DDTHH:mm:ss");
    const expiresAt = currDate.add(10, "minute").format("YYYY-MM-DDTHH:mm:ss");

    // format the results to fit as an array
    const formattedSeats: (string | number)[] = [];
    foundSeats.forEach((seat) => {
      const uniqueId = randomUUID();
      formattedSeats.push(
        uniqueId,
        schedule.scheduleId,
        res.locals.userId!,
        "reserved",
        createdAt,
        expiresAt,
        seat.row,
        seat.column
      );
    });
    result = await dbQuery(
      `INSERT INTO reservations(id, schedule_id, user_id, status, created_at, expires_at, seat_row, seat_col)
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
    };
    res.status(200).json(response);
    /*   ----- start section: formatting and sending response --------- */
    return;
  } catch (error) {
    console.log(error);
    // checks if the error was a validation error
    if (validationResponse(error, res)) return;
    res.status(500).json({ error: "Internal error server" });
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
