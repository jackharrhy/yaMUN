import { JSONSchemaType } from "ajv";
import debugFactory from "debug";
import express from "express";
import Schedule, { ISchedule } from "../../models/schedule";
import { ISemester } from "../../models/semester";
import User from "../../models/user";
import { handleRequestBody } from "../../utils/ajv";
import { BadRequest, NotFoundError } from "../errors";

const debug = debugFactory("backend/api/controllers/schedules");

interface ICreateScheduleInput {
  title: ISchedule["title"];
  description: ISchedule["description"];
  semester: ISemester;
  courses: ISchedule["courses"];
  ownerId: string;
}

const createScheduleInputSchema: JSONSchemaType<ICreateScheduleInput> = {
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

const schedulesController = {
  async get(req: express.Request, res: express.Response) {
    const scheduleId = req.params.scheduleId;
    const schedule = await Schedule.findById(scheduleId);
    if (schedule === null) {
      throw new NotFoundError("schedule not found");
    } else {
      res.json(schedule);
    }
  },

  async create(req: express.Request, res: express.Response) {
    const createScheduleInput = handleRequestBody(
      createScheduleInputSchema,
      req.body
    );
    const user = await User.findById(createScheduleInput);

    if (user) {
      const schedule = await Schedule.create(req.body);
      debug("schedule", schedule);
      res.json(schedule);
    } else {
      throw new BadRequest("can't create schedule, user not found");
    }
  },

  async delete(req: express.Request, res: express.Response) {
    const scheduleId = req.params.scheduleId;
    const deleted = await Schedule.findByIdAndDelete(scheduleId);
    if (deleted) {
      res.sendStatus(204);
    } else {
      throw new BadRequest("could not delete schedule");
    }
  },

  async addCourse(req: express.Request, res: express.Response) {
    const scheduleId = req.params.scheduleId;
    const crn = Number(req.params.crn);
    const schedule = await Schedule.findById(scheduleId);
    if (schedule) {
      await schedule.addCourse(crn);
      res.sendStatus(204);
    } else {
      throw new NotFoundError("schedule not found");
    }
  },

  async removeCourse(req: express.Request, res: express.Response) {
    const scheduleId = req.params.scheduleId;
    const crn = Number(req.params.crn);
    const schedule = await Schedule.findById(scheduleId);
    if (schedule) {
      await schedule.removeCourse(crn);
      res.sendStatus(204);
    } else {
      throw new NotFoundError("schedule not found");
    }
  },
};

export default schedulesController;
