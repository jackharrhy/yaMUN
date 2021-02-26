import debugFactory from "debug";
import express from "express";
import Course from "../../models/schedule";

const debug = debugFactory("backend/api/controllers/schedules");

const schedulesController = {
  async scheduleByUserId(req: express.Request, res: express.Response) {
    const crn = req.params.crn;
    debug("crn", crn);
    const course = await Course.findOne({
      sections: { $elemMatch: { crn } },
    }).exec();
    debug("course", course);

    if (course === null) {
      res.sendStatus(404);
    } else {
      res.json(course);
    }
  },
};

export default schedulesController;
