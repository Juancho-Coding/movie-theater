import { Request, Response } from "express";
import { validationResult } from "express-validator";

/**
 * checks if there was a validation error and throws it
 * @param req
 */
export function validationResults(req: Request): void {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ValError(errors.array()[0].msg, 422);
  }
}

/**
 * checks if the error is a validation error and sends the response
 * @param error error received
 * @returns if error was validation error
 */
export function validationResponse(error: any, res: Response) {
  if (error instanceof ValError) {
    const validationError = <ValError>error;
    res.status(validationError.code).json({ message: validationError.message });
    return true;
  }
  return false;
}

/**
 * Custom error class for validation errors
 */
export class ValError extends Error {
  code: number;
  constructor(message: string, code: number) {
    super(message);
    this.name = "ValidationError";
    this.code = code;
  }
}
