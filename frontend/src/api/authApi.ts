import { userData } from "../context/AuthContext";
import { BASEURL } from "./apiHelper";

export async function makeLogin(
  email: string,
  password: string,
  dummy: boolean = false
): Promise<userData> {
  const response = await fetch(`${BASEURL}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, dummy }),
  });
  if (!response.ok) {
    const cause = await response.json();
    throw new Error(cause.msg);
  }
  const data: userData = await response.json();
  return data;
}

export async function makeSignup(
  name: string,
  email: string,
  password: string
) {
  const response = await fetch(`${BASEURL}/users/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });
  if (!response.ok) {
    const cause = await response.json();
    throw new Error(cause.msg);
  }
  const result = await response.json();
  return { status: true, message: result.msg };
}
