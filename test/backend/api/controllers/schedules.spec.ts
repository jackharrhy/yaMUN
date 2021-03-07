import { expect } from "chai";
import { Express } from "express";
import { describe } from "mocha";
import { Types } from "mongoose";
import request, { SuperAgentTest } from "supertest";

import api from "../../../../src/backend/api";
import Schedule from "../../../../src/backend/models/schedule";
import User from "../../../../src/backend/models/user";
import { testSemester1, testSemester1Crns } from "../../../test-data";
import { dropCollection } from "../../../test-utils";

describe("backend/api/controllers/schedules", function () {
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
    await agent.post("/users").send({ username: "test", password: "test" });
    await agent.post("/login").send({ username: "test", password: "test" });
  });

  it("fail to find schedule that doesn't exist", async function () {
    const fakeObjectId = Types.ObjectId();
    const resp = await agent.get(`/schedules/${fakeObjectId}`).expect(403);

    expect(resp.body.error).to.match(/not authorized/);
  });

  it("fail to find schedule with invalid ObjectId", async function () {
    const invalidObjectId = "{<NOT VALID>}";
    const resp = await agent.get(`/schedules/${invalidObjectId}`).expect(400);

    expect(resp.body.error).to.match(/wasn't a valid ObjectId/);
  });

  it("fail to find schedule that exists, but is private and belongs to a different user", async function () {
    const scheduleCreateResp = await agent
      .post("/schedules")
      .send({
        title: "foo",
        description: "bar",
        public: false,
        semester: testSemester1,
      })
      .expect(200);

    const resp = await request(app)
      .get(`/schedules/${scheduleCreateResp.body._id}`)
      .expect(403);

    expect(resp.body.error).to.match(/not authorized/);
  });

  it("creates a schedule, returns it, and returns same schedule when requested", async function () {
    const title = "foo";
    const description = "bar";
    const isPublic = false;
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

    delete scheduleCreateResp.body.semester._id; // semester from request has ObjectId, to deep equal semester must be removed

    expect(scheduleCreateResp.body).to.have.property("_id");
    expect(scheduleCreateResp.body).to.have.property("owner");
    expect(scheduleCreateResp.body.title).to.equal(title);
    expect(scheduleCreateResp.body.description).to.equal(description);
    expect(scheduleCreateResp.body.courses)
      .to.be.an("array")
      .that.is.lengthOf(0);
    expect(scheduleCreateResp.body.semester).to.deep.equal(semester);
    expect(scheduleCreateResp.body.public).to.be.false;

    const resp = await agent.get(`/schedules/${scheduleCreateResp.body._id}`);

    expect(scheduleCreateResp.body._id).to.equal(resp.body._id);
  });

  it("creates multiple different schedules that are empty on creation", async function () {
    const firstResp = await agent
      .post("/schedules")
      .send({
        title: "one",
        description: "one",
        public: false,
        semester: testSemester1,
      })
      .expect(200);
    expect(firstResp.body.courses).to.be.an("array").that.is.lengthOf(0);

    const secondResp = await agent
      .post("/schedules")
      .send({
        title: "one",
        description: "one",
        public: false,
        semester: testSemester1,
      })
      .expect(200);
    expect(secondResp.body.courses).to.be.an("array").that.is.lengthOf(0);

    expect(firstResp.body._id).not.to.equal(secondResp.body._id);
  });

  it("created schedules are owned by the current user", async function () {
    const resp = await agent
      .post("/schedules")
      .send({
        title: "mine",
        description: "and only mine",
        public: false,
        semester: testSemester1,
      })
      .expect(200);

    const userRequest = await agent.get("/users").expect(200);
    expect(resp.body.owner).to.equal(userRequest.body._id);
  });

  it("fails to create on invalid schedule shapes", async function () {
    await agent
      .post("/schedules")
      .send({
        title: NaN,
        description: "one",
        public: false,
        foo: null,
        semester: testSemester1,
      })
      .expect(400);

    await agent.post("/schedules").send({}).expect(400);

    await agent.post("/schedules").send({ turnDownFor: "what" }).expect(400);
  });

  it("create schedule, returns meta, then modifies, and returns differnt meta", async function () {
    const firstGetResp = await agent
      .post("/schedules")
      .send({
        title: "title meta",
        description: "description meta",
        public: false,
        semester: testSemester1,
      })
      .expect(200);

    expect(firstGetResp.body.title).to.equal("title meta");
    expect(firstGetResp.body.description).to.equal("description meta");

    await agent
      .put(`/schedules/${firstGetResp.body._id}`)
      .send({
        title: "title new meta",
        description: "description new meta",
        public: false,
      })
      .expect(204);

    const secondGetResp = await agent
      .get(`/schedules/${firstGetResp.body._id}`)
      .expect(200);

    expect(secondGetResp.body.title).to.equal("title new meta");
    expect(secondGetResp.body.description).to.equal("description new meta");
  });

  it("create private schedule, non-auth'd user can't see it, makes it public, then non-auth'd user can now view", async function () {
    const createResp = await agent
      .post("/schedules")
      .send({
        title: "title",
        description: "description",
        public: false,
        semester: testSemester1,
      })
      .expect(200);

    const notAuthResp = await request(app)
      .get(`/schedules/${createResp.body._id}`)
      .expect(403);

    expect(notAuthResp.body.error).to.match(/not authorized/);

    await agent
      .put(`/schedules/${createResp.body._id}`)
      .send({
        title: "title",
        description: "description",
        public: true,
      })
      .expect(204);

    const resp = await request(app)
      .get(`/schedules/${createResp.body._id}`)
      .expect(200);

    expect(resp.body._id).to.equal(createResp.body._id);
  });

  it("create public schedule, verify other logged in users can see it", async function () {
    const createResp = await agent
      .post("/schedules")
      .send({
        title: "title",
        description: "description",
        public: true,
        semester: testSemester1,
      })
      .expect(200);

    const otherAgent = request.agent(app);
    await otherAgent
      .post("/users")
      .send({ username: "other", password: "other" });
    await otherAgent
      .post("/login")
      .send({ username: "other", password: "other" });

    const resp = await otherAgent
      .get(`/schedules/${createResp.body._id}`)
      .expect(200);

    expect(resp.body._id).to.equal(createResp.body._id);
  });

  it("add a selection of courses to schedule, verify they are added", async function () {
    const createResp = await agent
      .post("/schedules")
      .send({
        title: "title",
        description: "description",
        public: true,
        semester: testSemester1,
      })
      .expect(200);

    await agent
      .put(`/schedules/${createResp.body._id}/${testSemester1Crns[0]}`)
      .expect(204);
    await agent
      .put(`/schedules/${createResp.body._id}/${testSemester1Crns[1]}`)
      .expect(204);

    const resp = await agent
      .get(`/schedules/${createResp.body._id}`)
      .expect(200);

    expect(resp.body.courses).to.deep.equal([
      testSemester1Crns[0],
      testSemester1Crns[1],
    ]);
  });

  it("remove courses from schedule, even though its empty", async function () {
    const createResp = await agent
      .post("/schedules")
      .send({
        title: "title",
        description: "description",
        public: true,
        semester: testSemester1,
      })
      .expect(200);

    expect(createResp.body.courses).to.have.lengthOf(0);

    const resp = await agent
      .get(`/schedules/${createResp.body._id}`)
      .expect(200);

    expect(resp.body.courses).to.have.lengthOf(0);
  });

  it("add, then remove course from schedule", async function () {
    const createResp = await agent
      .post("/schedules")
      .send({
        title: "title",
        description: "description",
        public: true,
        semester: testSemester1,
      })
      .expect(200);

    await agent
      .put(`/schedules/${createResp.body._id}/${testSemester1Crns[0]}`)
      .expect(204);

    const respBeforeDelete = await agent
      .get(`/schedules/${createResp.body._id}`)
      .expect(200);

    expect(respBeforeDelete.body.courses).to.deep.equal([testSemester1Crns[0]]);

    await agent
      .delete(`/schedules/${createResp.body._id}/${testSemester1Crns[0]}`)
      .expect(204);

    const respAfterDelete = await agent
      .get(`/schedules/${createResp.body._id}`)
      .expect(200);

    expect(respAfterDelete.body.courses).to.have.lengthOf(0);
  });

  it("can't add invalid courses to schedule", async function () {
    const createResp = await agent
      .post("/schedules")
      .send({
        title: "title",
        description: "description",
        public: true,
        semester: testSemester1,
      })
      .expect(200);

    await agent.put(`/schedules/${createResp.body._id}/{invalid}`).expect(400);
    await agent.put(`/schedules/${createResp.body._id}/-1`).expect(404);

    const resp = await agent
      .get(`/schedules/${createResp.body._id}`)
      .expect(200);

    expect(resp.body.courses).to.have.lengthOf(0);
  });
});
