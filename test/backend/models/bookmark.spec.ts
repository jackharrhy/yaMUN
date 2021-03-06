import { use, expect } from "chai";
import { describe } from "mocha";
import chaiAsPromised from "chai-as-promised";

import Bookmark from "../../../src/backend/models/bookmark";
import User from "../../../src/backend/models/user";
import { testSemesterCrns } from "../../setup.spec";
import { NotFoundError } from "../../../src/backend/api/errors";

use(chaiAsPromised);

describe("backend/models/bookmark", function () {
  let userId: string;

  this.beforeEach(async () => {
    await Bookmark.deleteMany({});
    await User.deleteMany({});

    await User.createUser("test", "test");
    userId = (await User.findOne({}))._id;
  });

  it("find/create user bookmark", async function () {
    const bookmark = await Bookmark.findOrCreateByUserId(userId);
    expect(bookmark.owner.toString()).to.equal(userId.toString());
  });

  it("create user bookmarks and add two courses to it", async function () {
    const bookmark = await Bookmark.findOrCreateByUserId(userId);
    await bookmark.addCourse(testSemesterCrns[0]);
    await bookmark.addCourse(testSemesterCrns[1]);
    expect(bookmark.courses).to.contain(testSemesterCrns[0]);
    expect(bookmark.courses).to.contain(testSemesterCrns[1]);
  });

  it("create user bookmarks, add a course and then delete it", async function () {
    const bookmark = await Bookmark.findOrCreateByUserId(userId);
    await bookmark.addCourse(testSemesterCrns[0]);
    expect(bookmark.courses).to.contain(testSemesterCrns[0]);
    await bookmark.removeCourse(testSemesterCrns[0]);
    expect(bookmark.courses).not.to.contain(testSemesterCrns[0]);
  });

  it("create user bookmarks, add a non-existant course crn, should throw exception", async function () {
    const bookmark = await Bookmark.findOrCreateByUserId(userId);
    await expect(bookmark.addCourse(123456)).to.be.rejectedWith(NotFoundError, "course not found");
  });

});