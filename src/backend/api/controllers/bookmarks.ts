import debugFactory from "debug";
import express from "express";
// import Bookmark, { IBookmark } from "../../models/bookmark";

const debug = debugFactory("backend/api/controllers/bookmarks");

const bookmarksController = {
  async getCourseBookmarks(req: express.Request, res: express.Response) {
    // TODO
  },

  async addCourseBookmark(req: express.Request, res: express.Response) {
    // TODO
  },

  async deleteCourseBookmark(req: express.Request, res: express.Response) {
    // TODO
  },
};

export default bookmarksController;
