import { Request, Response, NextFunction } from "express";
import { dbQuery } from "../db/postgres";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";

import {
  validationResponse,
  validationResults,
} from "../utils/validationResult";
import { randomUUID } from "crypto";

const SALT_ROUNDS = 10;

/**
 * Perfomrs login of a user
 */
export async function loginUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  type userData = {
    name: string;
    userid: string;
    level: number;
    password: string;
  };

  const { email, password, dummy = false } = req.body;
  try {
    //checks for validation error before continuing
    validationResults(req);
    if (dummy) {
      const userData = await getDummyUser();
      if (!userData) {
        res.status(500).json({ msg: "Internal error server" });
        return;
      }
      const result = await saveNewUser(
        userData.name,
        userData.email,
        userData.password
      );
      if (!result.result) {
        res.status(500).json({ msg: "Internal error server" });
        return;
      }
      const jwt = jsonwebtoken.sign(
        { userid: result.userId, email: userData.email },
        process.env.JWT_SECRET!,
        { expiresIn: "1h" }
      );
      res.status(200).json({
        name: userData.name,
        email: userData.email,
        level: 0,
        token: jwt,
      });
      return;
    }
    // search for the user in the database
    const result = await dbQuery(
      `SELECT userid, name, level, password FROM users WHERE email = $1`,
      [email]
    );
    if (result.rows.length === 0) {
      // no user found with the email and password
      res.status(404).json({ msg: "The email or password is invalid" });
      return;
    }
    const user = result.rows[0] as userData;
    if (!(await bcrypt.compare(password, user.password))) {
      res.status(404).json({ msg: "The email or password is invalid" });
      return;
    }
    // create a jwt token and send it back to the user
    const jwt = jsonwebtoken.sign(
      { userid: user.userid, email: email },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );
    res
      .status(200)
      .json({ name: user.name, email: email, level: user.level, token: jwt });
  } catch (error) {
    // checks if the error was a validation error
    if (validationResponse(error, res)) return;
    res.status(500).json({ msg: "Internal error server" });
  }
}

/**
 * Signup a user
 */
export async function signupUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { name, email, password } = req.body;

  try {
    //checks for validation error before continuing
    validationResults(req);
    const result = await saveNewUser(name, email, password);
    if (!result.result) {
      res.status(400).json({ msg: "User already exists" });
      return;
    }
    res.status(200).json({ status: true, msg: `${name} was created` });
  } catch (error) {
    // checks if the error was a validation error
    if (validationResponse(error, res)) return;
    res.status(500).json({ msg: "Internal error server" });
  }
}

/**
 * Validates the user data, if correct insert it on DB
 * @param name name of new user
 * @param email email of new user
 * @param password new password
 * @returns boolean, true if success
 */
async function saveNewUser(name: string, email: string, password: string) {
  // find user with tha same parameters
  const existingUser = await dbQuery(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);
  if (existingUser.rows.length > 0) {
    return { result: false, userId: null };
  }
  // hash password and generate a new user id
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const newUserId = randomUUID();
  // save new user in the database
  await dbQuery(
    `INSERT INTO users (name, email, password, userid) VALUES ($1, $2, $3, $4)`,
    [name, email, hashedPassword, newUserId]
  );
  return { result: true, userId: newUserId };
}

/**
 * Generate a dummy user with name and email to be used, from randomuser.me
 * @returns user object with name, email and password or null if error ocurred
 */
async function getDummyUser() {
  type dummy = {
    results: {
      name: { title: string; first: string; last: string };
      email: string;
    }[];
    info: any;
  };
  try {
    const result = await fetch("https://randomuser.me/api/?inc=name,email");
    if (!result.ok) {
      return null;
    }
    const dummyUser: dummy = await result.json();
    return {
      name: `${dummyUser.results[0].name.first} ${dummyUser.results[0].name.last}`,
      email: dummyUser.results[0].email,
      password: Array.from({ length: 10 }, () =>
        Math.floor(Math.random() * 10)
      ).join(""),
    };
  } catch (error) {
    console.log(error);
    return null;
  }
}
