import debugFactory from "debug";
import express from "express";

const debug = debugFactory("backend/api/errors");

export class BadRequest extends Error {}
export class NotFoundError extends Error {}
export class Forbidden extends Error {}

export const errorHandlerMiddleware = async (
  error: Error,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  let status: number;
  let message: string;
  if (error instanceof BadRequest) {
    message = error.toString();
    status = 400;
  } else if (error instanceof Forbidden) {
    message = error.toString();
    status = 403;
  } else if (error instanceof NotFoundError) {
    message = error.toString();
    status = 404;
  } else {
    console.error(error);
    message = "Internal Server Error";
    status = 500;
  }

  debug("error", error.toString());
  res.status(status).json({ error: message });
};
