import { JSONSchemaType } from "ajv";
import debugFactory from "debug";
import express from "express";

import Schedule, { IScheduleDocument } from "../../models/schedule";
import { ISemester } from "../../models/semester";
import User from "../../models/user";
import { handleRequestBody } from "../../utils/ajv";
import { expectUserId, freshUserIdOrUndefined } from "../auth";
import { BadRequest, Forbidden } from "../errors";
import { stringToNumber } from "../utils";

const debug = debugFactory("backend/api/controllers/schedules");

interface ICreateScheduleInput {
  title: IScheduleDocument["title"];
  description: IScheduleDocument["description"];
  semester: ISemester;
  courses: IScheduleDocument["courses"];
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
  },
  required: ["title", "description", "semester"],
  additionalProperties: false,
};

const schedulesController = {
  async getById(req: express.Request, res: express.Response) {
    const userId = await freshUserIdOrUndefined(req);
    const scheduleId = req.params.scheduleId;

    const schedule: IScheduleDocument | null = await Schedule.findById(
      scheduleId
    ).exec();

    if (
      schedule !== null &&
      (schedule.public || userId === schedule.owner.toString)
    ) {
      res.json(schedule);
    } else {
      throw new Forbidden("not authorized");
    }
  },

  async create(req: express.Request, res: express.Response) {
    const userId = await expectUserId(req);
    const createScheduleInput = handleRequestBody(
      createScheduleInputSchema,
      req.body
    );

    const schedule = await Schedule.create({
      ...createScheduleInput,
      public: false,
      owner: userId,
    });
    res.json(schedule);
  },

  async delete(req: express.Request, res: express.Response) {
    const userId = await expectUserId(req);
    const scheduleId = req.params.scheduleId;

    const schedule: IScheduleDocument | null = await Schedule.findById(
      scheduleId
    ).exec();

    if (schedule !== null && userId === schedule.owner.toString()) {
      await Schedule.deleteOne({ _id: schedule._id });
      res.sendStatus(204);
    } else {
      throw new Forbidden("not authorized");
    }
  },

  async addCourse(req: express.Request, res: express.Response) {
    const userId = await expectUserId(req);
    const scheduleId = req.params.scheduleId;
    const crn = stringToNumber(req.params.crn, "crn");

    const schedule: IScheduleDocument | null = await Schedule.findById(
      scheduleId
    ).exec();

    if (schedule !== null && userId === schedule.owner.toString()) {
      await schedule.addCourse(crn);
      res.sendStatus(204);
    } else {
      throw new Forbidden("not authorized");
    }
  },

  async removeCourse(req: express.Request, res: express.Response) {
    const userId = await expectUserId(req);
    const scheduleId = req.params.scheduleId;
    const crn = stringToNumber(req.params.crn, "crn");

    const schedule: IScheduleDocument | null = await Schedule.findById(
      scheduleId
    ).exec();

    if (schedule !== null && userId === schedule.owner.toString()) {
      await schedule.removeCourse(crn);
      res.sendStatus(204);
    } else {
      throw new Forbidden("not authorized");
    }
  },
};

export default schedulesController;
