import { Express } from "express";
import { expect } from "chai";
import request from "supertest";
import { describe } from "mocha";

import api from "../../../../src/backend/api";

describe("backend/api/controllers/bookmarks", function () {
  let app: Express;

  this.beforeAll(async () => {
    const apiImported = api();
    app = apiImported.app;
  });

  it("add course crn 81797 to bookmarks", async function () {
    const resp = await request(app)
      .put("/bookmarks/courses/81797")
      .expect(204);
  });
  
  it("add course crn 92771 to bookmarks", async function () {
    const resp = await request(app)
      .put("/bookmarks/courses/92771")
      .expect(204);
  });

  it("get a list of course bookmarks (should be 2)", async function () {
    const resp = await request(app)
      .get("/bookmarks/courses")
      .expect(200);

    expect(resp.body.courses).to.have.lengthOf(2);
  });

  it("remove course crn 92771 from bookmarks", async function () {
    const resp = await request(app)
      .delete("/bookmarks/courses/92771")
      .expect(204);
  });

  it("get a list of course bookmarks (should be 1)", async function () {
    const resp = await request(app)
      .get("/bookmarks/courses")
      .expect(200);

    expect(resp.body.courses).to.have.lengthOf(1);
  });
});
