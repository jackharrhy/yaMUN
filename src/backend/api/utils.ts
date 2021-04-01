import { isValidObjectId, Types } from "mongoose";

import { BadRequest } from "./errors";

export function stringToNumber(string: string | undefined, context: string): number {
  const converted = Number(string);
  if(string === undefined) {
    throw new BadRequest(`${context} wasn't given`);
  } else if (Number.isNaN(converted)) {
    throw new BadRequest(`${context} wasn't a valid number`);
  } else {
    return converted;
  }
}

export function maybeStringToNumber(
  string: string | undefined,
  context: string
): number | undefined {
  if (string === undefined) {
    return undefined;
  } else {
    return stringToNumber(string, context);
  }
}

export function stringToObjectId(
  string: string,
  context: string
): Types.ObjectId {
  const isValid = isValidObjectId(string);

  if (isValid) {
    return Types.ObjectId(string);
  } else {
    throw new BadRequest(`${context} wasn't a valid ObjectId`);
  }
}
