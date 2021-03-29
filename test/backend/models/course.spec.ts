import { expect } from "chai";
import { describe } from "mocha";

import Course from "../../../src/backend/models/course";
import { testSemester1Sids } from "../../test-data";

describe("backend/models/course", function () {
  it("find course by sid", async function () {
    const course = await Course.findOneBySid(testSemester1Sids[0]);
    expect(course).to.have.property("subject");
    expect(course).to.have.property("number");
    expect(course).to.have.property("name");
  });

  it("try find course with non-existant sid", async function () {
    const course = await Course.findOneBySid("-1");
    expect(course).to.be.null;
  });

  it("find courses by subject", async function () {
    const courses = await Course.search({
      subject: "ANTH",
      page: 0,
      limit: 20,
    });

    for (const course of courses) {
      expect(course.subject).to.equal("ANTH");
    }
  });

  it("find courses with non-existant subject", async function () {
    const courses = await Course.search({
      subject: "MAGIC",
      page: 0,
      limit: 20,
    });
    expect(courses).to.have.length(0);
  });

  it("find courses that are taught on monday", async function () {
    const courses = await Course.search({ days: ["M"], page: 0, limit: 20 });

    for (const course of courses) {
      const containsAtLeastOneM = course.sections.some((section) =>
        section.slots.some((slot) => slot.days.includes("M"))
      );
      expect(containsAtLeastOneM).to.be.true;
    }
  });

  it("find courses taught by certain prof", async function () {
    const courses = await Course.search({
      prof: "M Bartha",
      page: 0,
      limit: 20,
    });

    for (const course of courses) {
      for (const section of course.sections) {
        expect(section.primaryInstructor).to.equal("M Bartha");
      }
    }
  });

  it("find courses taught by non-existant prof", async function () {
    const courses = await Course.search({ prof: "NONE", page: 0, limit: 20 });
    expect(courses).to.be.length(0);
  });

  it("retrieve at most 10 courses", async function () {
    const courses = await Course.search({ page: 0, limit: 10 });
    expect(courses).to.have.length(10).at.most;
  });

  it("test pagination", async function () {
    const coursesPageOne = await Course.search({ page: 0, limit: 10 });
    const coursesPageOneAgain = await Course.search({ page: 0, limit: 10 });
    const coursesPageTwo = await Course.search({ page: 1, limit: 10 });

    expect(
      JSON.stringify(coursesPageOne) === JSON.stringify(coursesPageOneAgain)
    ).to.be.true;
    expect(JSON.stringify(coursesPageOne) === JSON.stringify(coursesPageTwo)).to
      .be.false;
  });
});
