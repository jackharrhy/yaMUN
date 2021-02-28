import debugFactory from "debug";
import express from "express";

import Course from "../../models/course";

const debug = debugFactory("backend/api/controllers/courses");

const COURSE_SEARCH_PAGINATION_LIMIT = 20;

const coursesController = {
  async search(req: express.Request, res: express.Response) {
    const page = Number(req.query.page ?? 0);
    const limit = Number(req.query.limit ?? COURSE_SEARCH_PAGINATION_LIMIT);

    const invalidPagination =
      limit > COURSE_SEARCH_PAGINATION_LIMIT ||
      Number.isNaN(page) ||
      Number.isNaN(limit);

    if (invalidPagination) {
      res.sendStatus(400);
      return;
    }

    const include = req.query.include?.toString().split(",");

    const semesterYear = Number(req.query.semesterYear);
    const semesterTerm = Number(req.query.semesterYear);
    const semesterLevel = Number(req.query.semesterYear);

    const subject = req.query.subject?.toString();
    const number = req.query.number?.toString();
    const name = req.query.name?.toString();

    const prof = req.query.prof?.toString();
    const day = req.query.day?.toString().split(",");
    const beginTime = Number(req.query.beginTime);
    const endTime = Number(req.query.beginTime);

    const results = await Course.search({
      page,
      limit,
      include,
      semesterYear: Number.isNaN(semesterYear) ? undefined : semesterYear,
      semesterTerm: Number.isNaN(semesterTerm) ? undefined : semesterTerm,
      semesterLevel: Number.isNaN(semesterLevel) ? undefined : semesterLevel,
      subject,
      number,
      name,
      prof,
      day,
      beginTime: Number.isNaN(beginTime) ? undefined : beginTime,
      endTime: Number.isNaN(beginTime) ? undefined : endTime,
    });

    res.json(results);
  },
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
