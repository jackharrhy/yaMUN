import debugFactory from "debug";
import express from "express";

import Course from "../../models/course";
import { NotFoundError, BadRequest } from "../errors";
import { stringToNumber } from "../utils";

const debug = debugFactory("backend/api/controllers/courses");

export const COURSE_SEARCH_PAGINATION_LIMIT = 20;

const coursesController = {
  async search(req: express.Request, res: express.Response) {
    const page = Number(req.query.page ?? 0);
    const limit = Number(req.query.limit ?? COURSE_SEARCH_PAGINATION_LIMIT);

    const invalidPagination =
      limit > COURSE_SEARCH_PAGINATION_LIMIT ||
      Number.isNaN(page) ||
      Number.isNaN(limit);

    if (invalidPagination) throw new BadRequest("invalid pagination");

    const include = req.query.include?.toString().split(",");

    const semesterYear = Number(req.query.semesterYear);
    const semesterTerm = Number(req.query.semesterYear);
    const semesterLevel = Number(req.query.semesterYear);

    const subject = req.query.subject?.toString();
    const number = req.query.number?.toString();
    const name = req.query.name?.toString();

    const prof = req.query.prof?.toString();
    const days = req.query.days?.toString().split(",");

    const beginTimeMax = Number(req.query.beginTimeMax);
    const beginTimeMin = Number(req.query.beginTimeMin);
    const endTimeMax = Number(req.query.beginTimeMax);
    const endTimeMin = Number(req.query.beginTimeMin);

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
      days,
      beginTimeMin: Number.isNaN(beginTimeMin) ? undefined : beginTimeMin,
      beginTimeMax: Number.isNaN(beginTimeMax) ? undefined : beginTimeMax,
      endTimeMin: Number.isNaN(beginTimeMin) ? undefined : endTimeMin,
      endTimeMax: Number.isNaN(beginTimeMax) ? undefined : endTimeMax,
    });

    res.json(results);
  },
  async courseByCrn(req: express.Request, res: express.Response) {
    const crn = stringToNumber(req.params.crn, "crn");

    const course = await Course.findOneByCrn(crn);
    debug("course", course);

    if (course === null) {
      throw new NotFoundError("course not found");
    } else {
      res.json(course);
    }
  },
};

export default coursesController;
