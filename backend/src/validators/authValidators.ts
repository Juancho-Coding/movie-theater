import { Request, Response, NextFunction } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { dbQuery } from "../db/postgres";

/**
 * Validates the login request
 */
export const loginValidator = [
  body("email").isEmail().notEmpty().withMessage("Email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

/**
 * Validates the signup request
 */
export const signupValidator = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().notEmpty().withMessage("Email is required"),
  body("password")
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      "Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one symbol"
    ),
];

/**
 * validates the token in the request, if exists continue exwecution of the middleware
 * if not, return error 403
 * @returns
 */
export const authValidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  try {
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      const result = <jwt.JwtPayload>jwt.verify(token, process.env.JWT_SECRET!);
      const email = result["email"];
      const userid = result["userid"];
      // if some of the values is missing inside the token
      if (email === undefined || userid === undefined) throw new Error();
      res.locals.email = email;
      res.locals.userId = userid;
      return next();
    }
    res.status(401).json({ error: "Access invalid or expired" });
  } catch (error) {
    res.status(401).json({ error: "Access invalid or expired" });
  }
};

/**
 * Validates that the user exits on the database
 */
export const userExistValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = res.locals.userId;
  try {
    const result = await dbQuery("SELECT * from users WHERE userId = $1", [
      userId,
    ]);
    if (result.rows.length !== 0) return next();
    res.status(404).json({ error: "User not found" });
  } catch (error) {
    res.status(404).json({ error: "User not Found" });
  }
};
