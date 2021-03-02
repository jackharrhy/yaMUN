import { expect } from "chai";
import { Express } from "express";
import { describe } from "mocha";
import request, { SuperAgentTest } from "supertest";

import api from "../../../../src/backend/api";
import Bookmark from "../../../../src/backend/models/bookmark";
import User from "../../../../src/backend/models/user";
import { testSemesterCrns } from "../../../setup.spec";
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

    await User.createUser("test", "test");
    agent = request.agent(app);
    await agent.post("/login").send({ username: "test", password: "test" });
  });

  it("add two different courses to bookmarks", async function () {
    await agent.put(`/bookmarks/courses/${testSemesterCrns[0]}`).expect(204);
    await agent.put(`/bookmarks/courses/${testSemesterCrns[1]}`).expect(204);

    const resp = await agent.get("/bookmarks/courses").expect(200);
    expect(resp.body.courses).to.have.lengthOf(2);
  });

  it("add the same courses to bookmarks twice", async function () {
    await agent.put(`/bookmarks/courses/${testSemesterCrns[0]}`).expect(204);
    await agent.put(`/bookmarks/courses/${testSemesterCrns[0]}`).expect(204);

    const resp = await agent.get("/bookmarks/courses").expect(200);
    expect(resp.body.courses).to.have.lengthOf(1);
  });

  it("add course to bookmarks, and then remove it", async function () {
    await agent.put(`/bookmarks/courses/${testSemesterCrns[0]}`).expect(204);
    await agent.delete(`/bookmarks/courses/${testSemesterCrns[0]}`).expect(204);

    const resp = await agent.get("/bookmarks/courses").expect(200);
    expect(resp.body.courses).to.have.lengthOf(0);
  });

  it("get bookmarks before creating any", async function () {
    const resp = await agent.get("/bookmarks/courses").expect(200);
    expect(resp.body.courses).to.have.lengthOf(0);
  });
});
