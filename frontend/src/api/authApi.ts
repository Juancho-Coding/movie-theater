import { userData } from "../context/AuthContext";

export async function makeLogin(
  email: string,
  password: string
): Promise<userData> {
  //TODO implement the api for loging in
  return {
    name: "szdsadsadas",
    email: email,
    level: 2,
    token: "3423423432",
  };
}

export async function makeSignup(
  name: string,
  email: string,
  password: string
) {
  // TODO implement the api for sigining up
  return { status: true, message: "User created, please login" };
}
