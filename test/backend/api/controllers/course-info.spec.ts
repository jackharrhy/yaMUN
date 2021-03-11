import { expect } from "chai";
import { Express } from "express";
import { describe } from "mocha";
import request from "supertest";

import api from "../../../../src/backend/api";

describe("backend/api/controllers/course-info", function () {
  let app: Express;

  this.beforeAll(async () => {
    const apiImported = api();
    app = apiImported.app;
  });

  it("returns course given subject and number", async function () {
    const resp = await request(app).get("/course-info/COMP/3100").expect(200);
    expect(resp.body.subject).to.equal("COMP");
    expect(resp.body.number).to.equal("3100");
  });

  it("returns all courses from given subject", async function () {
    const resp = await request(app).get("/course-info/COMP").expect(200);
    expect(resp.body).to.have.lengthOf(2);
  });

  it("requesting course that won't be found", async function () {
    await request(app).get("/course-info/COMP/0110").expect(404);
  });

  it("requesting subject that won't be found", async function () {
    await request(app).get("/course-info/MAGIC/3100").expect(404);
  });
});
