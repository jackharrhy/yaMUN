import { expect } from "chai";
import { describe } from "mocha";

import Course from "../../../src/backend/models/course";
import { testSemesterCrns } from "../../setup.spec";

describe("backend/models/course", function () {
  it("find course by crn", async function () {
    const course = await Course.findOneByCrn(testSemesterCrns[0]);
    expect(course).to.have.property("subject");
    expect(course).to.have.property("number");
    expect(course).to.have.property("name");
  });

  it("try find course with non-existant crn", async function () {
    const course = await Course.findOneByCrn(-1);
    expect(course).to.be.null;
  });

  it("find courses by subject", async function () {
    const courses = await Course.search({
      subject: "ANTH",
      page: 0,
      limit: 20,
    });
    courses.every((c) => expect(c).property("subject").to.equal("ANTH"));
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
    courses.every((courses) => {
      expect(
        courses.sections.some(function (section) {
          return section.slots.some(function (slot) {
            return slot.days.includes("M");
          });
        })
      ).to.equal(true);
    });
  });

  it("find courses taught by certain prof", async function () {
    const courses = await Course.search({
      prof: "M Bartha",
      page: 0,
      limit: 20,
    });
    courses.every((c) => {
      c.sections.every((s) => {
        expect(s).to.have.property("primaryInstructor").equal("M Bartha");
      });
    });
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
    const coursesPageTwo = await Course.search({ page: 1, limit: 10 });
    for (let i = 0; i < coursesPageOne.length; i++) {
      expect(
        coursesPageOne[i].subject == coursesPageTwo[i].subject &&
          coursesPageOne[i].number == coursesPageTwo[i].number
      ).to.equal(false);
    }
  });
});
