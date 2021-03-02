import { JSONSchemaType } from "ajv";
import debugFactory from "debug";
import express from "express";
import Schedule, { IScheduleDocument } from "../../models/schedule";
import { ISemester } from "../../models/semester";
import User from "../../models/user";
import { handleRequestBody } from "../../utils/ajv";
import { BadRequest, NotFoundError } from "../errors";
import { stringToNumber } from "../utils";

const debug = debugFactory("backend/api/controllers/schedules");

interface ICreateScheduleInput {
  title: IScheduleDocument["title"];
  description: IScheduleDocument["description"];
  semester: ISemester;
  courses: IScheduleDocument["courses"];
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
  async getById(req: express.Request, res: express.Response) {
    const scheduleId = req.params.scheduleId;

    // TODO ensure auth'd user can get schedule

    const schedule: IScheduleDocument | null = await Schedule.findById(
      scheduleId
    ).exec();

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

    // TODO ensure auth'd user is same as ownerId of input

    const user = await User.findById(createScheduleInput.ownerId);

    if (user === null) {
      throw new BadRequest("can't create schedule, user not found");
    } else {
      const schedule = await Schedule.create(req.body);
      debug("schedule", schedule);
      res.json(schedule);
    }
  },

  async delete(req: express.Request, res: express.Response) {
    const scheduleId = req.params.scheduleId;

    // TODO ensure auth'd user is same as schedules owner

    const deletedDocument: IScheduleDocument | null = await Schedule.findByIdAndDelete(
      scheduleId
    ).exec();

    if (deletedDocument === null) {
      throw new NotFoundError("schedule not found");
    } else {
      res.sendStatus(204);
    }
  },

  async addCourse(req: express.Request, res: express.Response) {
    const scheduleId = req.params.scheduleId;
    const crn = stringToNumber(req.params.crn, "crn");

    // TODO ensure auth'd user is same as schedules owner

    const schedule: IScheduleDocument | null = await Schedule.findById(
      scheduleId
    ).exec();

    if (schedule === null) {
      throw new NotFoundError("schedule not found");
    } else {
      await schedule.addCourse(crn);
      res.sendStatus(204);
    }
  },

  async removeCourse(req: express.Request, res: express.Response) {
    const scheduleId = req.params.scheduleId;
    const crn = stringToNumber(req.params.crn, "crn");

    // TODO ensure auth'd user is same as schedules owner

    const schedule: IScheduleDocument | null = await Schedule.findById(
      scheduleId
    ).exec();

    if (schedule === null) {
      throw new NotFoundError("schedule not found");
    } else {
      await schedule.removeCourse(crn);
      res.sendStatus(204);
    }
  },
};

export default schedulesController;
