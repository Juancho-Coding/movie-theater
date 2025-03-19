import { ApiError, BASEURL } from "./apiHelper";

type ReservationRes = {
  auditorium: string[];
  seats: { row: number; column: number }[];
  status: boolean;
  session: number;
  schedule: string;
};

export async function getResevationSeats(
  token: string | undefined,
  movieId: number,
  date: string,
  time: string,
  seats: number
) {
  // validates token
  if (token === undefined) throw new Error("Authentication expired");
  const response = await fetch(`${BASEURL}/reserve/reserveSeats`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      movie: movieId,
      date: date,
      time: time,
      seats: seats,
    }),
  });
  if (!response.ok) {
    const cause = await response.json();
    //token expired or failed
    if (response.status === 401) throw new ApiError(401, cause.msg);
    throw new Error(cause.msg);
  }
  const data: ReservationRes = await response.json();
  // transforms layout into boolean array
  const layout = data.auditorium.map((row) => {
    return row.split("").map((x) => parseInt(x));
  });
  return {
    seats: data.seats,
    status: data.status,
    layout,
    session: data.session,
    schedule: data.schedule,
  };
}

export async function reserveOneSeat(
  token: string | undefined,
  session: number,
  row: number,
  column: number,
  schedule: string
) {
  // validates token
  if (token === undefined) throw new Error("Authentication expired");
  const response = await fetch(`${BASEURL}/reserve/reserveSingleSeat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      session: session,
      row: row,
      column: column,
      schedule,
    }),
  });
  if (!response.ok) {
    const cause = await response.json();
    //token expired or failed
    if (response.status === 401) throw new ApiError(401, cause.msg);
    throw new Error(cause.msg);
  }
  const data: { msg: string; row: number; col: number } = await response.json();
  return data;
}

export async function unreserveOneSeat(
  token: string | undefined,
  session: number,
  row: number,
  column: number
) {
  // validates token
  if (token === undefined) throw new Error("Authentication expired");
  const response = await fetch(
    `${BASEURL}/reserve/removeReservedSeat/${session}/${row}/${column}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) {
    const cause = await response.json();
    //token expired or failed
    if (response.status === 401) throw new ApiError(401, cause.msg);
    throw new Error(cause.msg);
  }
  const data: { deletedRow: number; deletedCol: number } =
    await response.json();
  return data;
}
