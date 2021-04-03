import { expect } from "chai";
import { Express } from "express";
import { describe } from "mocha";
import { Types } from "mongoose";
import request, { SuperAgentTest } from "supertest";

import api from "../../../../src/backend/api";
import Schedule from "../../../../src/backend/models/schedule";
import User from "../../../../src/backend/models/user";
import { testSemester2, testSemester2Sids } from "../../../test-data";
import { dropCollection } from "../../../test-utils";

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
    await dropCollection("sessions");

    agent = request.agent(app);
    await agent
      .post("/users")
      .send({ username: "test", password: "long valid password" });
    await agent
      .post("/login")
      .send({ username: "test", password: "long valid password" });
  });

  it("create valid schedule with two courses, and exports", async function () {
    const title = "foo";
    const description = "bar";
    const isPublic = true;

    const scheduleCreateResp = await agent
      .post("/schedules")
      .send({
        title,
        description,
        isPublic,
        semester: testSemester2,
      })
      .expect(200);

    await agent
      .put(`/schedules/${scheduleCreateResp.body._id}/${testSemester2Sids[0]}`)
      .expect(204);

    await agent
      .put(`/schedules/${scheduleCreateResp.body._id}/${testSemester2Sids[1]}`)
      .expect(204);

    const exportResp = await agent.get(
      `/export/schedules/${scheduleCreateResp.body._id}/ics/?startYear=2020&startMonth=01&startDay=01&endYear=2021&endMonth=02&endDay=02`
    );

    expect(exportResp.text)
      .to.be.a("string")
      .and.satisfy((str: string) => str.startsWith("BEGIN:VCALENDAR"));
  });

  it("exporting schedule that won't be found", async function () {
    const fakeObjectId = Types.ObjectId();
    await agent.get(`/export/schedules/${fakeObjectId}/ics/?startYear=2020&startMonth=01&startDay=01&endYear=2021&endMonth=02&endDay=02`).expect(403);
  });

  it("exporting schedule that you are not authorized to view", async function () {
    const title = "foo";
    const description = "bar";
    const isPublic = true;

    const scheduleCreateResp = await agent
      .post("/schedules")
      .send({
        title,
        description,
        isPublic,
        semester: testSemester2,
      })
      .expect(200);

    await request(app)
      .get(`/export/schedules/${scheduleCreateResp.body._id}/ics`)
      .expect(403);
  });
});
