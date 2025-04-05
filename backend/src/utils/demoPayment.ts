import dayjs from "dayjs";

export async function demoPayment(
  cardHolder: string,
  cardNumber: string,
  cardExp: string,
  cardCode: string
): Promise<{ error: boolean; code: number; msg: string }> {
  // funcion que debe recibir info de pago, validar ciertos valores y devolver una respuesta afirmativa
  //o negativa
  const cardValid = isValidCreditCard(cardNumber);
  const holderValid = cardHolder.length > 3; // at least 3 characters for the name
  const [month, year] = cardExp.split("/");
  const currentYear = parseInt(("" + dayjs().utc().get("year")).substring(2));
  const currentMonth = dayjs().utc().get("month") + 1; // month start with 0
  const monthValid = parseInt(month) > 0 && parseInt(month) < 13;
  const expValid =
    (parseInt(year) > currentYear && monthValid) ||
    (parseInt(year) === currentYear &&
      monthValid &&
      parseInt(month) >= currentMonth);
  const codeSanitized = cardCode.replace(/\D/g, "");
  const codeValid =
    [3, 4].includes(codeSanitized.length) &&
    !Number.isNaN(parseInt(codeSanitized)); //longitud valida de 3 o 4 char
  if (!cardValid || !holderValid || !expValid || !codeValid)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ error: true, code: 403, msg: "Invalid information" });
      }, Math.random() * 2000); // 2 seconds max
    });
  // validation succeed
  return new Promise((resolve) => {
    const card = cardNumber.replace(/\D/g, "");
    const termination = parseInt(card.substring(card.length - 1));
    let response = [0, 1, 2, 3, 4, 5].includes(termination)
      ? { error: false, code: 200, msg: "Payment completed" }
      : { error: true, code: 402, msg: "Card Declined" };
    setTimeout(() => {
      resolve(response);
    }, Math.random() * 2000); // 2 seconds max
  });
}

/**
 * Demo function to validate card, as card is not real, numbers could be wrong
 * @param cardNumber
 * @returns boolean valid
 */
function isValidCreditCard(cardNumber: string): boolean {
  // Remove all non-numeric characters (e.g., spaces or dashes)
  const sanitized = cardNumber.replace(/\D/g, "");
  if (sanitized.length < 13 || sanitized.length > 19) {
    return false; // Card numbers are typically between 13 and 19 digits
  }
  // For more robust validation,m could implement luhn algorithm if
  // payment is real
  return true;
}
