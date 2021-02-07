import { JSONSchemaType } from "ajv";

import { ISlot } from "../../../database/models/slot";
import { handleMatch } from "../../../utils/ajv";

export const SLOT_REGEX = /^.{48}(?<slot>( |\d|[A-Z]){4}) (?<days>(M| ) (T| ) (W| ) (R| ) (F| ) (S| ) (U| )) ((?<beginTime>\d{4})|    ) ((?<endTime>\d{4})|   ) ((?<room>(([A-Z]  )|([A-Z]{2} )|([A-Z]{3}))((\d){4}([A-Z])?))|)/;

interface ISlotMatch {
  slot: string;
  days: string;
  beginTime: string;
  endTime: string;
  room: string;
}

const slotSchema: JSONSchemaType<ISlotMatch> = {
  type: "object",
  properties: {
    slot: { type: "string" },
    days: { type: "string" },
    beginTime: { type: "string" },
    endTime: { type: "string" },
    room: { type: "string" },
  },
  required: ["slot", "days"],
  additionalProperties: false,
};

export function matchToSlot(match: RegExpExecArray): ISlot {
  const slotMatch = handleMatch(slotSchema, match);

  return {
    ...slotMatch,
    beginTime: slotMatch.beginTime ? parseInt(slotMatch.beginTime, 10) : null,
  };
}
