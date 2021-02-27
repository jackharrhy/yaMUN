import Ajv, { JSONSchemaType } from "ajv";
import debugFactory from "debug";
import express from "express";
import Course from "../../models/course";
import Schedule, { ISchedule } from "../../models/schedule";
import { ISemester } from "../../models/semester";
import User from "../../models/user";

const debug = debugFactory("backend/api/controllers/schedules");
const ajv = new Ajv();

interface ICreateSchemaInput {
  title: ISchedule["title"];
  description: ISchedule["description"];
  semester: ISemester;
  courses: ISchedule["courses"];
  ownerId: string;
}

const ScheduleValidator: JSONSchemaType<ICreateSchemaInput> = {
  type: "object",
  properties: {
    title: { type: "string" },
    description: { type: "string" },
    semester: {
      type: "object",
      properties: {
        year: { type: "number" },
        term: { type: "number" },
        level: { type: "number" },
      },
      required: ["year", "term", "level"],
      additionalProperties: false,
    },
    courses: { type: "array", items: { type: "number" } },
    ownerId: { type: "string" },
  },
  required: ["title", "description", "semester", "ownerId"],
  additionalProperties: false,
};

const validate = ajv.compile(ScheduleValidator);

const schedulesController = {
  async create(req: express.Request, res: express.Response) {
    if (validate(req.body)) {
      const user = await User.findById(req.body.ownerId);
      if (user) {
        const schedule = await Schedule.create(req.body);
        debug("schedule", schedule);
        res.json(schedule);
      } else {
        res.sendStatus(400);
      }
    } else {
      res.sendStatus(400);
    }
  },

  async addCourse(req: express.Request, res: express.Response) {
    const scheduleId = req.params.scheduleId;
    const crn = Number(req.params.crn);
    const schedule = await Schedule.findById(scheduleId);
    if (schedule) {
      if (await Course.findOneByCrn(crn)) {
        if (schedule.courses === undefined) {
          schedule.courses = [crn];
        } else {
          schedule.courses.push(crn);
        }
        const save = await schedule.save();
        if (save === schedule) {
          res.send(schedule);
        } else {
          res.sendStatus(500);
        }
      } else {
        res.sendStatus(400);
      }
    } else {
      res.sendStatus(400);
    }
  },
};

export default schedulesController;
