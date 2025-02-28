import { Request, Response, NextFunction } from "express";

export default function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // TODO implement log of errors
  res.status(500).send(error);
}
