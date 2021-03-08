import { Express } from "express";
import { describe } from "mocha";
import request, { SuperAgentTest } from "supertest";

import api from "../../../../src/backend/api";
import { ICourse } from "../../../../src/backend/models/course";
import Schedule from "../../../../src/backend/models/schedule";
import Course, { ISection } from "../../../../src/backend/models/section";
import { ISlot } from "../../../../src/backend/models/slot";
import User from "../../../../src/backend/models/user";
import insertData from "../../../../src/backend/scrape/banner/insert";
import { testSemester1 } from "../../../test-data";
import { dropCollection } from "../../../test-utils";

let slot1: ISlot = {
  slot: "one",
  days: ["Monday", "Wednesday", "Friday"],
  beginTime: 1000,
  endTime: 1050,
  room: "ENG-1014",
};
let slot2: ISlot = {
  slot: "two",
  days: ["Thursday"],
  beginTime: 1430,
  endTime: 1050,
  room: "ENG-1017",
};

let slots1: ISlot[] = [slot1];
let slots2: ISlot[] = [slot2];

let section1: ISection = {
  section: "003",
  crn: 37583,
  scheduleType: null,
  phoneOne: "phoneOne",
  phoneTwo: "phoneTwo",
  waitList: false,
  preCheck: false,
  reserved: null,
  attr: "test",
  creditHours: null,
  billedHours: null,
  primaryInstructor: null,
  secondaryInstructor: null,
  slots: slots1,
};

let section2: ISection = {
  section: "005",
  crn: 38450,
  scheduleType: null,
  phoneOne: "phoneThree",
  phoneTwo: "phoneFour",
  waitList: false,
  preCheck: false,
  reserved: null,
  attr: "test2",
  creditHours: null,
  billedHours: null,
  primaryInstructor: null,
  secondaryInstructor: null,
  slots: slots2,
};
let sections1: ISection[] = [section1];
let sections2: ISection[] = [section2];
let crns: number[] = [37583, 38450];

let course1: ICourse = {
  semester: testSemester1,
  campus: "St. John's",
  session: "Session",
  subject: "Science",
  number: "3400",
  name: "Chemistry",
  sections: sections1,
};

let course2: ICourse = {
  semester: testSemester1,
  campus: "St. John's",
  session: "Session",
  subject: "Science",
  number: "3500",
  name: "Physics",
  sections: sections2,
};

describe("backend/api/controllers/exports", function () {
  let app: Express;
  let agent: SuperAgentTest;

  this.beforeAll(async () => {
    const apiImported = api();
    app = apiImported.app;
  });

  this.beforeEach(async () => {
    await Schedule.deleteMany({});
    await User.deleteMany({});
    await Course.deleteMany({});
    await dropCollection("sessions");

    insertData([course1, course2]);

    agent = request.agent(app);
    await agent.post("/users").send({ username: "test", password: "test" });
    await agent.post("/login").send({ username: "test", password: "test" });
  });

  it("create valid schedule with one course, and export", async function () {
    const title = "foo";
    const description = "bar";
    const isPublic = true;
    const semester = testSemester1;

    const scheduleCreateResp = await agent
      .post("/schedules")
      .send({
        title,
        description,
        public: isPublic,
        semester,
      })
      .expect(200);

    await agent
      .put(`/schedules/${scheduleCreateResp.body._id}/${crns[0]}`)
      .expect(204);

    await agent
      .put(`/schedules/${scheduleCreateResp.body._id}/${crns[1]}`)
      .expect(204);

    //console.log(scheduleCreateResp.body._id);

    const exportResp = await agent
      .get(`/export/schedules/${scheduleCreateResp.body._id}/ics`)
      .expect(200);
  });
});
