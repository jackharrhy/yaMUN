import { ISlot } from "./slot";

export interface ISection {
  section: string;
  crn: number;
  scheduleType: string;
  phoneOne: string; // TODO enum
  phoneTwo: string; // TODO enum
  waitList: boolean;
  preCheck: boolean;
  reserved: string | null; // TODO enum
  attr: string; // TODO enum
  creditHours: number;
  billedHours: number;
  primaryInstructor: string | null;
  secondaryInstructor: string | null;
  slots: ISlot[];
}
