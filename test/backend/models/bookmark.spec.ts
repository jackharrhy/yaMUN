import { expect } from "chai";
import { describe } from "mocha";
import { Types } from "mongoose";

import { NotFoundError } from "../../../src/backend/api/errors";
import Bookmark from "../../../src/backend/models/bookmark";
import User from "../../../src/backend/models/user";
import { testSemester1Crns } from "../../test-data";

describe("backend/models/bookmark", function () {
  let userId: Types.ObjectId;

  this.beforeEach(async () => {
    await Bookmark.deleteMany({});
    await User.deleteMany({});

    userId = (await User.createUser("test", "long valid password"))._id;
  });

  it("find/create user bookmark", async function () {
    const bookmark = await Bookmark.findOrCreateByUserId(userId);
    expect(bookmark.owner.toString()).to.equal(userId.toString());
    expect(bookmark.courses).to.be.length(0);
  });

  it("create user bookmarks, add two courses to it", async function () {
    const bookmark = await Bookmark.findOrCreateByUserId(userId);
    await bookmark.addCourse(testSemester1Crns[0]);
    await bookmark.addCourse(testSemester1Crns[1]);
    expect(bookmark.courses).to.contain(testSemester1Crns[0]);
    expect(bookmark.courses).to.contain(testSemester1Crns[1]);
  });

  it("create user bookmarks, add a course and then delete it", async function () {
    const bookmark = await Bookmark.findOrCreateByUserId(userId);
    await bookmark.addCourse(testSemester1Crns[0]);
    expect(bookmark.courses).to.contain(testSemester1Crns[0]);
    expect(bookmark.courses).to.be.length(1);
    await bookmark.removeCourse(testSemester1Crns[0]);
    expect(bookmark.courses).not.to.contain(testSemester1Crns[0]);
    expect(bookmark.courses).to.be.length(0);
  });

  it("create user bookmarks, add a non-existant course crn", async function () {
    const bookmark = await Bookmark.findOrCreateByUserId(userId);
    await expect(bookmark.addCourse(-1)).to.be.rejectedWith(
      NotFoundError,
      "course not found"
    );
  });
});
