import BASEURL, { ApiError } from "./apiHelper";

/**
 * validates if the number of the credit card is valid and return the card type
 * @param number credit card number
 * @returns credit card error and icon
 */
export async function validateCreditCard(number: string) {
  // use of api to validate credit card numbers and INN
  // https://algobook.info/docs/credit-card-api?utm_source=chatgpt.com
  const response = await fetch(
    `https://api.algobook.info/v1/card/verify?number=${number}`
  );
  if (!response.ok) {
    const cause = await response.json();
    throw new Error(cause);
  }
  const cardInfo = await response.json();
  if (isValidRes(cardInfo)) {
    // if needs to validate deeply the card number use cardInfo.valid
    return { error: false, cardIcon: cardInfo.cardType + ".png" };
  } else {
    // invalid card
    return { error: true, cardIcon: "none" };
  }
}

type ApiOkRes = { cardType: string; valid: boolean; prefixValid: boolean };
type ApiErrorRes = { error: string };
// type guard for the card validation response
function isValidRes(response: ApiErrorRes | ApiOkRes): response is ApiOkRes {
  return (response as ApiErrorRes).error === undefined;
}

export async function makePayment(
  token: string | undefined,
  sessionId: number,
  holder: string,
  cardNumber: string,
  exp: string,
  cvv: string,
  scheduleId: string
) {
  // validates token
  if (token === undefined) throw new Error("Authentication expired");
  const response = await fetch(`${BASEURL}/payment/makePayment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      session: sessionId,
      schedule: scheduleId,
      holder: holder,
      card: cardNumber,
      cardExp: exp,
      cardCVV: cvv,
    }),
  });
  if (!response.ok) {
    const cause = await response.json();
    //token expired or failed
    if (response.status === 401) throw new ApiError(401, cause.msg);
    throw new Error(cause.msg);
  }
  const data = (await response.json()) as { error: boolean; msg: string };
  return data;
}

export async function sendEmailTickets(
  token: string | undefined,
  email: string,
  movie: string,
  time: string,
  blob: Blob
) {
  // validates token
  if (token === undefined) throw new Error("Authentication expired");
  const formData = new FormData();
  formData.append("pdf", blob, "tickets.pdf");
  formData.append("email", email);
  formData.append("movie", movie);
  formData.append("time", time);
  const response = await fetch(`${BASEURL}/tickets/sendTicketEmail`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "ngrok-skip-browser-warning": "true",
    },
    body: formData,
  });
  if (!response.ok) {
    const cause = await response.json();
    //token expired or failed
    if (response.status === 401) throw new ApiError(401, cause.msg);
    throw new Error(cause.msg);
  }
  const data = await response.json();
  return data.msg;
}
