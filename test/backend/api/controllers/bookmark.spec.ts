import { Express } from "express";
import { expect } from "chai";
import request from "supertest";
import { describe } from "mocha";

import api from "../../../../src/backend/api";
import Bookmark from "../../../../src/backend/models/bookmark";

describe("backend/api/controllers/bookmarks", function () {
  let app: Express;

  this.beforeAll(async () => {
    const apiImported = api();
    app = apiImported.app;
  });

  this.afterEach(async () => {
    await Bookmark.deleteMany({});
  });

  it("add courses crn 81797 and 92771 to bookmarks", async function () {
    let resp = await request(app).put("/bookmarks/courses/81797").expect(204);

    resp = await request(app).put("/bookmarks/courses/92771").expect(204);

    resp = await request(app).get("/bookmarks/courses").expect(200);

    expect(resp.body.courses).to.have.lengthOf(2);
  });

  it("add course crn 92771 to bookmarks and remove it", async function () {
    let resp = await request(app).put("/bookmarks/courses/92771").expect(204);

    resp = await request(app).delete("/bookmarks/courses/92771").expect(204);

    resp = await request(app).get("/bookmarks/courses").expect(200);

    expect(resp.body.courses).to.have.lengthOf(0);
  });

  it("get a list of course bookmarks (should be empty aka 404)", async function () {
    const resp = await request(app).get("/bookmarks/courses").expect(404);
  });
});
