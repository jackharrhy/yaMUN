import debugFactory from "debug";
import express from "express";

const debug = debugFactory("backend/api/errors");

export class BadRequest extends Error {}
export class NotFoundError extends Error {}

export const errorHandlerMiddleware = async (
  error: Error,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  let status: number;
  if (error instanceof BadRequest) {
    status = 400;
  } else if (error instanceof NotFoundError) {
    status = 404;
  } else {
    console.error(error);
    status = 500;
  }

  debug("error", error.toString());
  res.status(status).json({ error: error.toString() });
};
