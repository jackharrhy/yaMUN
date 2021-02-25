import Ajv, { JSONSchemaType } from "ajv";

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
