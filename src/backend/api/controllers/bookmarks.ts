import express from "express";
import Bookmark from "../../models/bookmark";
import { BadRequest, NotFoundError } from "../errors";

const bookmarksController = {
  async getCourseBookmarks(req: express.Request, res: express.Response) {
    // TODO: Get currently authed user.
    const userId = "603d3e6cd8dc460c06082299";
    const bookmark = await Bookmark.findByUserId(userId);
    if(bookmark === null) {
      throw new NotFoundError("bookmark not found");
    } else {
      res.json(bookmark);
    }
  },

  async addCourseBookmark(req: express.Request, res: express.Response) {
    // TODO: Get currently authed user.
    const userId = "603d3e6cd8dc460c06082299";
    const crn = Number(req.params.crn);

    if(Number.isNaN(crn)) {
      throw new BadRequest("crn wasn't a valid number");
    }

    const bookmark = await Bookmark.findOrCreateByUserId(userId);
    await bookmark.addCourse(crn);
    res.sendStatus(204);
  },

  async deleteCourseBookmark(req: express.Request, res: express.Response) {
    // TODO: Get currently authed user.
    const userId = "603d3e6cd8dc460c06082299";
    const crn = Number(req.params.crn);

    if(Number.isNaN(crn)) {
      throw new BadRequest("crn wasn't a valid number");
    }

    const bookmark = await Bookmark.findByUserId(userId);
    if(bookmark) {
      await bookmark.removeCourse(crn);
      res.sendStatus(204);
    } else {
      throw new NotFoundError("bookmark not found")
    }
  },
};

export default bookmarksController;
