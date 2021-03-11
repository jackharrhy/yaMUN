import debugFactory from "debug";
import express from "express";

import CourseInfo, { ICourseInfoDocument } from "../../models/course-info";
import { NotFoundError } from "../errors";

const debug = debugFactory("backend/api/controllers/course-info");

const courseInfoController = {
  async course(req: express.Request, res: express.Response) {
    const subject = req.params.subject;
    const number = req.params.number;

    debug("course", subject, number);

    const courseInfo = await CourseInfo.findOne({ subject, number });

    if (courseInfo === null) {
      throw new NotFoundError("course not found");
    } else {
      res.json(courseInfo);
    }
  },

  async allCoursesOfSubject(req: express.Request, res: express.Response) {
    const subject = req.params.subject;

    debug("allCoursesFromSubject", subject);

    const courseInfos: ICourseInfoDocument[] = await CourseInfo.find({
      subject,
    });

    if (courseInfos.length === 0) {
      throw new NotFoundError("subject not found");
    } else {
      res.json(courseInfos);
    }
  },
};

export default courseInfoController;
