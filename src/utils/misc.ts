export function stringToBool(str: string): boolean {
  if (str === "Y") return true;
  if (str === "N") return false;
  throw new Error(`Got invalid boolean: ${str}`);
}

export function stringToNumber(str: string): number | null {
  const converted = parseInt(str, 10);
  return Number.isInteger(converted) ? converted : null;
}
