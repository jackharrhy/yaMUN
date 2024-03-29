import { JSONSchemaType } from "ajv";
import debugFactory from "debug";
import express from "express";

import Schedule, { IScheduleDocument } from "../../models/schedule";
import { ISemester } from "../../models/semester";
import { handleRequestBody } from "../../utils/ajv";
import { expectUserId, freshUserIdOrUndefined } from "../auth";
import { Forbidden } from "../errors";
import { stringToObjectId } from "../utils";

const debug = debugFactory("backend/api/controllers/schedules");

export interface ICreateScheduleInput {
  title: IScheduleDocument["title"];
  description: IScheduleDocument["description"];
  isPublic: IScheduleDocument["isPublic"];
  semester: ISemester;
}

export interface IUpdateScheduleMeta {
  title: IScheduleDocument["title"];
  description: IScheduleDocument["description"];
  isPublic: IScheduleDocument["isPublic"];
}

const createScheduleInputSchema: JSONSchemaType<ICreateScheduleInput> = {
  type: "object",
  properties: {
    title: { type: "string" },
    description: { type: "string" },
    isPublic: { type: "boolean" },
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
  },
  required: ["title", "description", "semester"],
  additionalProperties: false,
};

const updateMetaInputSchema: JSONSchemaType<IUpdateScheduleMeta> = {
  type: "object",
  properties: {
    title: { type: "string" },
    description: { type: "string" },
    isPublic: { type: "boolean" },
  },
  required: ["title", "description", "isPublic"],
  additionalProperties: false,
};

const schedulesController = {
  // TODO test route
  async getCurrentUsersSchedules(req: express.Request, res: express.Response) {
    const userId = await expectUserId(req);
    const schedules: IScheduleDocument[] = await Schedule.find({
      owner: userId,
    }).exec();
    res.json(schedules);
  },

  async getById(req: express.Request, res: express.Response) {
    const userId = await freshUserIdOrUndefined(req);
    const scheduleId = stringToObjectId(req.params.scheduleId, "scheduleId");
    debug("getById", userId, scheduleId);

    const schedule: IScheduleDocument | null = await Schedule.findById(
      scheduleId
    )
      .populate("resolvedCourses")
      .exec();

    if (
      schedule !== null &&
      (schedule.isPublic || userId?.equals(schedule.owner))
    ) {
      res.json(schedule);
    } else {
      throw new Forbidden("not authorized");
    }
  },

  async create(req: express.Request, res: express.Response) {
    const userId = await expectUserId(req);
    debug("create", userId);

    const createScheduleInput = handleRequestBody(
      createScheduleInputSchema,
      req.body
    );

    const schedule = await Schedule.create({
      ...createScheduleInput,
      owner: userId,
      courses: [],
    });
    res.json(schedule);
  },

  async updateMeta(req: express.Request, res: express.Response) {
    const userId = await expectUserId(req);
    const scheduleId = stringToObjectId(req.params.scheduleId, "scheduleId");
    debug("updateMeta", userId, scheduleId);

    const updateMetaInput = handleRequestBody(updateMetaInputSchema, req.body);

    const schedule: IScheduleDocument | null = await Schedule.findById(
      scheduleId
    ).exec();

    if (schedule !== null && userId.equals(schedule.owner)) {
      await schedule.updateMeta(
        updateMetaInput.title,
        updateMetaInput.description,
        updateMetaInput.isPublic
      );
      res.sendStatus(204);
    } else {
      throw new Forbidden("not authorized");
    }
  },

  async delete(req: express.Request, res: express.Response) {
    const userId = await expectUserId(req);
    const scheduleId = stringToObjectId(req.params.scheduleId, "scheduleId");
    debug("delete", userId, scheduleId);

    const schedule: IScheduleDocument | null = await Schedule.findById(
      scheduleId
    ).exec();

    if (schedule !== null && userId.equals(schedule.owner)) {
      await Schedule.deleteOne({ _id: schedule._id });
      res.sendStatus(204);
    } else {
      throw new Forbidden("not authorized");
    }
  },

  async addCourse(req: express.Request, res: express.Response) {
    const userId = await expectUserId(req);
    const scheduleId = req.params.scheduleId;
    const sid = req.params.sid;

    const schedule: IScheduleDocument | null = await Schedule.findById(
      scheduleId
    ).exec();

    if (schedule !== null && userId.equals(schedule.owner)) {
      await schedule.addCourse(sid);
      res.sendStatus(204);
    } else {
      throw new Forbidden("not authorized");
    }
  },

  async removeCourse(req: express.Request, res: express.Response) {
    const userId = await expectUserId(req);
    const scheduleId = req.params.scheduleId;
    const sid = req.params.sid;

    const schedule: IScheduleDocument | null = await Schedule.findById(
      scheduleId
    ).exec();

    if (schedule !== null && userId.equals(schedule.owner)) {
      await schedule.removeCourse(sid);
      res.sendStatus(204);
    } else {
      throw new Forbidden("not authorized");
    }
  },
};

export default schedulesController;
