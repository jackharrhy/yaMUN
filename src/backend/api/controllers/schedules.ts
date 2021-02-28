import Ajv, { JSONSchemaType } from "ajv";
import debugFactory from "debug";
import express from "express";
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
  async get(req: express.Request, res: express.Response) {
    const scheduleId = req.params.scheduleId;
    const schedule = await Schedule.findById(scheduleId);
    if (schedule) {
      res.json(schedule);
    } else {
      res.sendStatus(404);
    }
  },

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

  async delete(req: express.Request, res: express.Response) {
    const scheduleId = req.params.scheduleId;
    const deleted = await Schedule.findByIdAndDelete(scheduleId);
    if (deleted) {
      res.json(deleted);
    } else {
      res.sendStatus(400);
    }
  },

  async addCourse(req: express.Request, res: express.Response) {
    const scheduleId = req.params.scheduleId;
    const crn = Number(req.params.crn);
    const schedule = await Schedule.findById(scheduleId);
    if (schedule) {
      const added = await schedule.addCourse(crn);
      if (added) {
        res.json(schedule);
      } else {
        res.sendStatus(400);
      }
    } else {
      res.sendStatus(400);
    }
  },

  async removeCourse(req: express.Request, res: express.Response) {
    const scheduleId = req.params.scheduleId;
    const crn = Number(req.params.crn);
    const schedule = await Schedule.findById(scheduleId);
    if (schedule) {
      const removed = await schedule.removeCourse(crn);
      if (removed) {
        res.json(schedule);
      } else {
        res.sendStatus(400);
      }
    } else {
      res.sendStatus(400);
    }
  },
};

export default schedulesController;
