import { ApiError, BASEURL } from "./apiHelper";

type ReservationRes = {
  auditorium: string[];
  seats: { row: number; column: number }[];
  status: boolean;
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
    if (response.status === 401) throw new ApiError(401, cause.message);
    throw new Error(cause.message);
  }
  const data: ReservationRes = await response.json();
  // transforms layout into boolean array
  const layout = data.auditorium.map((row) => {
    return row.split("").map((x) => parseInt(x));
  });
  data.seats.forEach((seat) => {
    layout[seat.row - 1][seat.column - 1] = 2;
  });
  return { seats: data.seats, status: data.status, layout };
}
