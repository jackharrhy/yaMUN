import { JSONSchemaType } from "ajv";

enum DayOfWeek {
  Monday = "Monday",
  Tuesday = "Tuesday",
  Wednesday = "Wednesday",
  Thursday = "Thursday",
  Friday = "Friday",
  Saturday = "Saturday",
  Sunday = "Sunday",
}

export interface ISlot {
  slot: string;
  days: DayOfWeek[];
  beginTime: number;
  endTime: number;
  room: string;
}

export const slotSchema: JSONSchemaType<ISlot> = {
  type: "object",
  properties: {
    slot: { type: "string" },
    days: {
      type: "array",
      items: {
        type: "string",
        enum: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
      },
    },
    beginTime: { type: "number" },
    endTime: { type: "number" },
    room: { type: "string" },
  },
  required: ["slot", "days"],
  additionalProperties: false,
};
