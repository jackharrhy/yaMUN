import { expect } from "chai";
import { describe } from "mocha";
import { Types } from "mongoose";

import { NotFoundError } from "../../../src/backend/api/errors";
import Schedule from "../../../src/backend/models/schedule";
import User from "../../../src/backend/models/user";
import { testSemester1, testSemester1Sids } from "../../test-data";

describe("backend/models/schedule", function () {
  let userId: Types.ObjectId;

  this.beforeEach(async () => {
    await Schedule.deleteMany({});
    await User.deleteMany({});

    userId = (await User.createUser("test", "long valid password"))._id;
  });

  it("create schedule for a user", async function () {
    const schedule = await Schedule.create({
      owner: userId,
      semester: testSemester1,
    });
    expect(schedule).property("owner").to.equal(userId);
  });

  it("create schedule for a user, make it public, and change its title and description", async function () {
    const schedule = await Schedule.create({
      owner: userId,
      semester: testSemester1,
    });
    expect(schedule).property("owner").to.equal(userId);
    schedule.updateMeta("My Public Schedule", "A public schedule.", true);
    expect(schedule).property("title").to.equal("My Public Schedule");
    expect(schedule).property("description").to.equal("A public schedule.");
    expect(schedule).property("isPublic").to.be.true;
  });

  it("create schedule for a user, add a course to it", async function () {
    const schedule = await Schedule.create({
      owner: userId,
      semester: testSemester1,
    });
    expect(schedule).property("owner").to.equal(userId);
    expect(schedule).property("courses").to.be.length(0);
    await schedule.addCourse(testSemester1Sids[0]);
    expect(schedule).property("courses").to.be.length(1);
  });

  it("create schedule for a user, add two courses to it and then delete one", async function () {
    const schedule = await Schedule.create({
      owner: userId,
      semester: testSemester1,
    });
    expect(schedule).property("owner").to.equal(userId);
    expect(schedule).property("courses").to.be.length(0);
    await schedule.addCourse(testSemester1Sids[0]);
    await schedule.addCourse(testSemester1Sids[1]);
    expect(schedule).property("courses").to.be.length(2);
    await schedule.removeCourse(testSemester1Sids[1]);
    expect(schedule).property("courses").to.be.length(1);
  });

  it("create schedule for a user, and try to add course from another semester", async function () {
    const schedule = await Schedule.create({
      owner: userId,
      semester: testSemester1,
    });
    expect(schedule).property("owner").to.equal(userId);
    expect(schedule).property("courses").to.be.length(0);
    await schedule.addCourse(testSemester1Sids[0]);
    await schedule.addCourse(testSemester1Sids[1]);
    expect(schedule).property("courses").to.be.length(2);
    await schedule.removeCourse(testSemester1Sids[1]);
    expect(schedule).property("courses").to.be.length(1);
  });

  it("create two different schedules for a user", async function () {
    const scheduleOne = await Schedule.create({
      owner: userId,
      semester: testSemester1,
    });
    const scheduleTwo = await Schedule.create({
      owner: userId,
      semester: testSemester1,
    });

    expect(scheduleOne).property("owner").to.equal(userId);
    expect(scheduleTwo).property("owner").to.equal(userId);
    expect(scheduleOne).property("courses").to.be.length(0);
    expect(scheduleTwo).property("owner").to.equal(userId);
    expect(scheduleOne._id).to.not.equal(scheduleTwo._id);
  });

  it("create schedule, change meta, and then change it again", async function () {
    const schedule = await Schedule.create({
      owner: userId,
      semester: testSemester1,
    });
    expect(schedule).property("owner").to.equal(userId);
    schedule.updateMeta("My Public Schedule", "A public schedule.", true);
    expect(schedule).property("title").to.equal("My Public Schedule");
    expect(schedule).property("description").to.equal("A public schedule.");
    expect(schedule).property("isPublic").to.equal(true);
    schedule.updateMeta("My Private Schedule", "A private schedule.", false);
    expect(schedule).property("title").to.equal("My Private Schedule");
    expect(schedule).property("description").to.equal("A private schedule.");
    expect(schedule).property("isPublic").to.equal(false);
  });

  it("create schedule for a user, add invalid courses to it", async function () {
    const schedule = await Schedule.create({
      owner: userId,
      semester: testSemester1,
    });
    expect(schedule).property("owner").to.equal(userId);
    expect(schedule).property("courses").to.be.length(0);
    const invalidCourseAdd = schedule.addCourse("-1");
    await expect(invalidCourseAdd).to.be.eventually.rejectedWith(
      NotFoundError,
      "course not found"
    );
  });
});
