import dayjs from "dayjs";
import { dbQuery, dbQueryWithClient } from "../db/postgres";
import { sioServer } from "../socketServer";

export default async function watchReservations() {
  setInterval(async () => {
    let client = null;
    try {
      client = await dbQueryWithClient();
      client.query("START TRANSACTION");
      const day = dayjs().utc().format();
      console.log(day);
      const result = await dbQuery(
        `DELETE FROM reservations WHERE expires_at < $1 AND status='pending' RETURNING schedule_id, seat_row, seat_col`,
        [day]
      );
      client.query("COMMIT");
      console.log(day, result.rows.length);
      if (result.rows.length === 0) return;
      if (sioServer === null) return;
      const reservations = result.rows as {
        schedule_id: string;
        seat_row: number;
        seat_col: number;
      }[];
      for (let i = 0; i < reservations.length; i++) {
        sioServer.to(reservations[i].schedule_id).emit("event", {
          status: false,
          row: reservations[i].seat_row,
          col: reservations[i].seat_col,
        });
      }
    } catch (error) {
      if (client !== null) await client.query("ROLLBACK");
      console.log(error);
    } finally {
      if (client !== null) client.release();
    }
  }, 30000);
}
