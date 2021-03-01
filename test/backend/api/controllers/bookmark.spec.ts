import { Express } from "express";
import { expect } from "chai";
import request from "supertest";
import { describe } from "mocha";

import api from "../../../../src/backend/api";
import Bookmark from "../../../../src/backend/models/bookmark";
import { testSemesterCrns } from "../../../setup.spec";
import User from "../../../../src/backend/models/user";

describe("backend/api/controllers/bookmarks", function () {
  let app: Express;

  this.beforeAll(async () => {
    const apiImported = api();
    app = apiImported.app;
  });

  this.beforeEach(async () => {
    await Bookmark.deleteMany({});
    await User.deleteMany({});
    await User.create({
      username: "test",
      password: "test",
      email: "test@example.com",
    });
  });

  it("add two different courses to bookmarks", async function () {
    // TODO auth user

    await request(app)
      .put(`/bookmarks/courses/${testSemesterCrns[0]}`)
      .expect(204);
    await request(app)
      .put(`/bookmarks/courses/${testSemesterCrns[1]}`)
      .expect(204);

    const resp = await request(app).get("/bookmarks/courses").expect(200);
    expect(resp.body.courses).to.have.lengthOf(2);
  });

  it("add the same courses to bookmarks twice", async function () {
    // TODO auth user

    await request(app)
      .put(`/bookmarks/courses/${testSemesterCrns[0]}`)
      .expect(204);
    await request(app)
      .put(`/bookmarks/courses/${testSemesterCrns[0]}`)
      .expect(204);

    const resp = await request(app).get("/bookmarks/courses").expect(200);
    expect(resp.body.courses).to.have.lengthOf(1);
  });

  it("add course to bookmarks, and then remove it", async function () {
    // TODO auth user

    await request(app)
      .put(`/bookmarks/courses/${testSemesterCrns[0]}`)
      .expect(204);
    await request(app)
      .delete(`/bookmarks/courses/${testSemesterCrns[0]}`)
      .expect(204);

    const resp = await request(app).get("/bookmarks/courses").expect(200);
    expect(resp.body.courses).to.have.lengthOf(0);
  });

  it("get bookmarks before creating any", async function () {
    // TODO auth user
    await request(app).get("/bookmarks/courses").expect(404);
  });
});
