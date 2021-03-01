import express from "express";
import Bookmark from "../../models/bookmark";
import User from "../../models/user";
import { Forbidden, NotFoundError } from "../errors";
import { stringToNumber } from "../utils";

const bookmarksController = {
  async getCourseBookmarks(req: express.Request, res: express.Response) {
    // TODO: Get currently authed user, instead of just the first found one
    const userId = (await User.findOne({}).exec()).id;
    if (userId === null) throw new Forbidden("not authorized");

    const bookmark = await Bookmark.findByUserId(userId);

    if (bookmark === null) {
      throw new NotFoundError("bookmark not found");
    } else {
      res.json(bookmark);
    }
  },

  async addCourseBookmark(req: express.Request, res: express.Response) {
    const crn = stringToNumber(req.params.crn, "crn");

    // TODO: Get currently authed user, instead of just the first found one
    const userId = (await User.findOne({}).exec()).id;
    if (userId === null) throw new Forbidden("not authorized");

    const bookmark = await Bookmark.findOrCreateByUserId(userId);
    await bookmark.addCourse(crn);
    res.sendStatus(204);
  },

  async deleteCourseBookmark(req: express.Request, res: express.Response) {
    const crn = stringToNumber(req.params.crn, "crn");

    // TODO: Get currently authed user, instead of just the first found one
    const userId = (await User.findOne({}).exec()).id;
    if (userId === null) throw new Forbidden("not authorized");

    const bookmark = await Bookmark.findByUserId(userId);

    if (bookmark === null) {
      throw new NotFoundError("bookmark not found");
    } else {
      await bookmark.removeCourse(crn);
      res.sendStatus(204);
    }
  },
};

export default bookmarksController;
