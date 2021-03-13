import debugFactory from "debug";
import express from "express";

import Course from "../../models/course";
import { NotFoundError, BadRequest } from "../errors";
import { maybeStringToNumber, stringToNumber } from "../utils";

const debug = debugFactory("backend/api/controllers/courses");

export const COURSE_SEARCH_PAGINATION_LIMIT = 20;

const coursesController = {
  async search(req: express.Request, res: express.Response) {
    const page = Number(req.query.page ?? 0);
    const limit = Number(req.query.limit ?? COURSE_SEARCH_PAGINATION_LIMIT);

    debug("search", page, limit);

    const invalidPagination =
      limit > COURSE_SEARCH_PAGINATION_LIMIT ||
      Number.isNaN(page) ||
      Number.isNaN(limit);

    if (invalidPagination) throw new BadRequest("invalid pagination");

    const include = req.query.include?.toString().split(",");

    const semesterYear = maybeStringToNumber(
      req.query.semesterYear?.toString(),
      "semesterYear"
    );
    const semesterTerm = maybeStringToNumber(
      req.query.semesterTerm?.toString(),
      "semesterTerm"
    );
    const semesterLevel = maybeStringToNumber(
      req.query.semesterLevel?.toString(),
      "semesterLevel"
    );

    const subject = req.query.subject?.toString();
    const number = req.query.number?.toString();
    const name = req.query.name?.toString();

    const prof = req.query.prof?.toString();
    const days = req.query.days?.toString().split(",");

    const beginTimeMax = maybeStringToNumber(
      req.query.beginTimeMax?.toString(),
      "beginTimeMax"
    );
    const beginTimeMin = maybeStringToNumber(
      req.query.beginTimeMin?.toString(),
      "beginTimeMin"
    );
    const endTimeMax = maybeStringToNumber(
      req.query.beginTimeMax?.toString(),
      "endTimeMax"
    );
    const endTimeMin = maybeStringToNumber(
      req.query.beginTimeMin?.toString(),
      "endTimeMin"
    );

    const results = await Course.search({
      page,
      limit,
      include,
      semesterYear,
      semesterTerm,
      semesterLevel,
      subject,
      number,
      name,
      prof,
      days,
      beginTimeMin,
      beginTimeMax,
      endTimeMin,
      endTimeMax,
    });

    res.json(results);
  },
  async courseByCrn(req: express.Request, res: express.Response) {
    const crn = stringToNumber(req.params.crn, "crn");
    const course = await Course.findOneByCrn(crn);
    debug("courseByCrn", crn);

    if (course === null) {
      throw new NotFoundError("course not found");
    } else {
      res.json(course);
    }
  },
  async subjects(req: express.Request, res: express.Response) {
    debug("subjects");
    const subjects = await Course.distinct("subject").exec();
    res.json(subjects);
  },
  async campuses(req: express.Request, res: express.Response) {
    debug("campuses");
    const campuses = await Course.distinct("campus").exec();
    res.json(campuses);
  },
};

export default coursesController;
