import { BadRequest } from "./errors";

export function stringToNumber(string: string, context: string) {
  const converted = Number(string);
  if (Number.isNaN(converted)) {
    throw new BadRequest(`${context} wasn't a valid number`);
  } else {
    return converted;
  }
}
