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
      const userid = randomUUID();
      const jwt = jsonwebtoken.sign(
        { userid: userid },
        process.env.JWT_SECRET!
      );
      res.status(200).json({
        name: "Average Joe",
        email: "averagejoe@average.com",
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
      res.status(404).json({ message: "The email or password is invalid" });
      return;
    }
    const user = result.rows[0] as userData;
    if (!(await bcrypt.compare(password, user.password))) {
      res.status(404).json({ message: "The email or password is invalid" });
      return;
    }
    // create a jwt token and send it back to the user
    const jwt = jsonwebtoken.sign(
      { userid: user.userid },
      process.env.JWT_SECRET!
    );
    res
      .status(200)
      .json({ name: user.name, email: email, level: user.level, token: jwt });
  } catch (error) {
    // checks if the error was a validation error
    if (validationResponse(error, res)) return;
    res.status(500).json({ message: "Internal error server" });
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
    // find user with tha same parameters
    const existingUser = await dbQuery(`SELECT * FROM users WHERE email = $1`, [
      email,
    ]);
    if (existingUser.rows.length > 0) {
      res.status(400).json({ message: "User already exists" });
      return;
    }
    // hash password and generate a new user id
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const newUserId = randomUUID();
    // save new user in the database
    await dbQuery(
      `INSERT INTO users (name, email, password, userid) VALUES ($1, $2, $3, $4)`,
      [name, email, hashedPassword, newUserId]
    );
    res.status(200).json({ status: true, message: `${name} was created` });
  } catch (error) {
    // checks if the error was a validation error
    if (validationResponse(error, res)) return;
    res.status(500).json({ message: "Internal error server" });
  }
}
