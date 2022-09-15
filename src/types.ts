export interface ISemester {
  year: number;
  term: number;
  level: number;
}

export interface ICampus {
  name: string;
}

export interface ISession {
  name: string;
}

export interface ISubject {
  name: string;
}

export interface ICourseNumber {
  name: string;
}

export interface ICourse {
  semester: ISemester;
  campus: ICampus;
  session: ISession;
  subject: ISubject;
  number: ICourseNumber;
  name: string;
  sections: ISection[];
}

export interface ICourseInfo {
  subject: ISubject;
  number: ICourseNumber;
  title: string;
  description: string;
  attributes: string[];
}

export interface ISection {
  sid: string;
  section: string;
  crn: number;
  scheduleType: string | null; // TODO enum?
  phoneOne: string; // TODO enum
  phoneTwo: string; // TODO enum
  waitList: boolean;
  preCheck: boolean;
  reserved: string | null; // TODO enum
  attr: string; // TODO enum
  creditHours: number | null;
  billedHours: number | null;
  primaryInstructor: IPeople | null;
  secondaryInstructor: IPeople | null;
  slots: ISlot[];
}

export enum DayOfWeek {
  Monday = "M",
  Tuesday = "T",
  Wednesday = "W",
  Thursday = "R",
  Friday = "F",
  Saturday = "S",
  Sunday = "U",
}

export interface IRoom {
  name: string;
}

export interface ISlot {
  slot: string;
  days: string[]; // TODO make use of DayOfWeek enum
  beginTime: number | null;
  endTime: number | null;
  room: IRoom | null;
}

export interface IDepartment {
  name: string;
}

export interface IPeople {
  bannerName: string;
  displayName: string;
  campus: ICampus;
  department: IDepartment;
  title: string;
  firstName: string;
  lastName: string;
  extension: string;
  location: string;
  email: string;
}
