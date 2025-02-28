import { Request, Response, NextFunction } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";

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
      res.locals.email = result["email"];
      next();
    }
    return res.status(403).json({ error: "Access invalid or expired" });
  } catch (error) {
    return res.status(403).json({ error: "Access invalid or expired" });
  }
};
