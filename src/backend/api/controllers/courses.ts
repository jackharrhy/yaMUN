import debugFactory from "debug";
import express from "express";

import Course from "../../models/course";
import { NotFoundError, BadRequest } from "../errors";
import { maybeStringToNumber } from "../utils";

const debug = debugFactory("backend/api/controllers/courses");

export const COURSE_SEARCH_PAGINATION_LIMIT = 20;

export interface IPossibleFilters {
  subjects: string[];
  campuses: string[];
  years: number[];
  terms: number[];
  levels: number[];
}

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
  async courseBySid(req: express.Request, res: express.Response) {
    const sid = req.params.sid;
    const course = await Course.findOneBySid(sid);
    debug("courseBySid", sid);

    if (course === null) {
      throw new NotFoundError("course not found");
    } else {
      res.json(course);
    }
  },
  async filters(req: express.Request, res: express.Response) {
    debug("filters");
    const subjects = await Course.distinct("subject").exec();
    const campuses = await Course.distinct("campus").exec();
    const years = await Course.distinct("semester.year").exec();
    const terms = await Course.distinct("semester.term").exec();
    const levels = await Course.distinct("semester.level").exec();

    const possibleFilters: IPossibleFilters = {
      subjects,
      campuses,
      years,
      terms,
      levels,
    };

    res.json(possibleFilters);
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
  async years(req: express.Request, res: express.Response) {
    debug("years");
    const years = await Course.distinct("semester.year").exec();
    res.json(years);
  },
  async terms(req: express.Request, res: express.Response) {
    debug("terms");
    const terms = await Course.distinct("semester.term").exec();
    res.json(terms);
  },
  async levels(req: express.Request, res: express.Response) {
    debug("levels");
    const levels = await Course.distinct("semester.level").exec();
    res.json(levels);
  },
};

export default coursesController;
