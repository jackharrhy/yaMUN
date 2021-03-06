import debugFactory from "debug";
import express from "express";

import Schedule, { IScheduleDocument } from "../../models/schedule";

const debug = debugFactory("backend/api/controllers/exports");

const exportsController = {
  async scheduleToICS(req: express.Request, res: express.Response) {
    const scheduleId = req.params.scheduleId;

    const schedule: IScheduleDocument | null = await Schedule.findById(
      scheduleId
    ).exec();

    // TODO
    res.json("TODO");
  },
};

export default exportsController;
