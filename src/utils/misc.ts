export function stringToBool(str: string): boolean {
  if (str === "Y") return true;
  if (str === "N") return false;
  throw new Error(`Got invalid boolean: ${str}`);
}
