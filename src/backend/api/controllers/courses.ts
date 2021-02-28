import debugFactory from "debug";
import express from "express";
import Course from "../../models/course";

const debug = debugFactory("backend/api/controllers/courses");

const coursesController = {
  async courseByCrn(req: express.Request, res: express.Response) {
    const crn = Number(req.params.crn);

    if (crn === NaN) {
      res.sendStatus(400);
    }

    debug("crn", crn);
    const course = await Course.findOneByCrn(crn);
    debug("course", course);

    if (course === null) {
      res.sendStatus(404);
    } else {
      res.json(course);
    }
  },
};

export default coursesController;
