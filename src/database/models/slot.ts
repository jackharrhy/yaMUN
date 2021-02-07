export enum DayOfWeek {
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
  beginTime: number | null;
  endTime: number | null;
  room: string | null;
}
