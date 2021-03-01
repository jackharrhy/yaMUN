import express from "express";
import Ajv, { JSONSchemaType } from "ajv";
import { BadRequest } from "../api/errors";

const ajv = new Ajv();

export default ajv;

export function handleMatch<T>(
  schema: JSONSchemaType<T>,
  match: RegExpExecArray
): T {
  const validate = ajv.compile(schema);
  if (validate(match.groups)) {
    return match.groups;
  }
  console.error(match);
  throw JSON.stringify(validate.errors, null, 2);
}

export function handleRequestBody<T>(
  schema: JSONSchemaType<T>,
  requestBody: express.Request
): T {
  const validate = ajv.compile(schema);
  if (validate(requestBody)) {
    return requestBody;
  }
  const errorsAsString = JSON.stringify(validate.errors, null, 2);
  throw new BadRequest(errorsAsString);
}
