import debugFactory from "debug";
import express from "express";

import Bookmark from "../../models/bookmark";
import { expectUserId } from "../auth";
import { NotFoundError } from "../errors";
import { stringToNumber } from "../utils";

const debug = debugFactory("backend/api/controllers/bookmarks");

const bookmarksController = {
  async getBookmarks(req: express.Request, res: express.Response) {
    const userId = await expectUserId(req);
    const bookmark = await Bookmark.findByUserId(userId);
    debug("getBookmarks", userId);

    if (bookmark === null) {
      throw new NotFoundError("bookmarks not found");
    } else {
      res.json(bookmark);
    }
  },

  async addCourseBookmark(req: express.Request, res: express.Response) {
    const userId = await expectUserId(req);
    const crn = stringToNumber(req.params.crn, "crn");
    debug("addCourseBookmark", userId, crn);

    const bookmark = await Bookmark.findOrCreateByUserId(userId);

    await bookmark.addCourse(crn);
    res.sendStatus(204);
  },

  async deleteCourseBookmark(req: express.Request, res: express.Response) {
    const userId = await expectUserId(req);
    const crn = stringToNumber(req.params.crn, "crn");
    debug("deleteCourseBookmark", userId, crn);

    const bookmark = await Bookmark.findByUserId(userId);

    if (bookmark === null) {
      throw new NotFoundError("bookmarks not found");
    } else {
      await bookmark.removeCourse(crn);
      res.sendStatus(204);
    }
  },
};

export default bookmarksController;
