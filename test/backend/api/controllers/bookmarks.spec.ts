import { expect } from "chai";
import { Express } from "express";
import { describe } from "mocha";
import request, { SuperAgentTest } from "supertest";

import api from "../../../../src/backend/api";
import Bookmark from "../../../../src/backend/models/bookmark";
import User from "../../../../src/backend/models/user";
import { testSemester1Crns } from "../../../test-data";
import { dropCollection } from "../../../test-utils";

describe("backend/api/controllers/bookmarks", function () {
  let app: Express;
  let agent: SuperAgentTest;

  this.beforeAll(async () => {
    const apiImported = api();
    app = apiImported.app;
  });

  this.beforeEach(async () => {
    await Bookmark.deleteMany({});
    await User.deleteMany({});
    await dropCollection("sessions");

    agent = request.agent(app);
    await agent.post("/users").send({ username: "test", password: "test" });
    await agent.post("/login").send({ username: "test", password: "test" });
  });

  it("add two different courses to bookmarks", async function () {
    await agent.put(`/bookmarks/courses/${testSemester1Crns[0]}`).expect(204);
    await agent.put(`/bookmarks/courses/${testSemester1Crns[1]}`).expect(204);

    const resp = await agent.get("/bookmarks/courses").expect(200);
    expect(resp.body.courses).to.have.lengthOf(2);
    expect(resp.body.courses[0]).to.equal(testSemester1Crns[0]);
    expect(resp.body.courses[1]).to.equal(testSemester1Crns[1]);
  });

  it("add the same courses to bookmarks twice", async function () {
    await agent.put(`/bookmarks/courses/${testSemester1Crns[0]}`).expect(204);
    await agent.put(`/bookmarks/courses/${testSemester1Crns[0]}`).expect(204);

    const resp = await agent.get("/bookmarks/courses").expect(200);
    expect(resp.body.courses).to.have.lengthOf(1);
    expect(resp.body.courses[0]).to.equal(testSemester1Crns[0]);
  });

  it("add course to bookmarks, and then remove it", async function () {
    await agent.put(`/bookmarks/courses/${testSemester1Crns[0]}`).expect(204);
    await agent.delete(`/bookmarks/courses/${testSemester1Crns[0]}`).expect(204);

    const resp = await agent.get("/bookmarks/courses").expect(200);
    expect(resp.body.courses).to.have.lengthOf(0);
  });

  it("remove a course that already doesn't exist in bookmarks", async function () {
    await agent.delete(`/bookmarks/courses/${testSemester1Crns[0]}`).expect(204);

    const resp = await agent.get("/bookmarks/courses").expect(200);
    expect(resp.body.courses).to.have.lengthOf(0);
  });

  it("get bookmarks before creating any", async function () {
    const resp = await agent.get("/bookmarks/courses").expect(200);
    expect(resp.body.courses).to.have.lengthOf(0);
  });

  it("add course that won't be found to bookmarks", async function () {
    const resp = await agent.put(`/bookmarks/courses/-1`).expect(404);
    expect(resp.body.error).to.match(/course not found/);
  });

  it("add invalid course bookmarks", async function () {
    const resp = await agent.put(`/bookmarks/courses/abc`).expect(400);
    expect(resp.body.error).to.match(/crn wasn't a valid number/);
  });

  it("be unable to request any bookmarks endpoint when logged out", async function () {
    await agent.get("/bookmarks/courses").expect(200);

    await agent.get(`/logout`).expect(204);

    await agent.get("/bookmarks/courses").expect(403);
    await agent.put(`/bookmarks/courses/${testSemester1Crns[0]}`).expect(403);
    await agent.delete(`/bookmarks/courses/${testSemester1Crns[0]}`).expect(403);
  });
});
