import { expect } from "chai";
import { Express } from "express";
import { describe } from "mocha";
import request from "supertest";

import api from "../../../../src/backend/api";
import { COURSE_SEARCH_PAGINATION_LIMIT } from "../../../../src/backend/api/controllers/courses";
import { testSemester2Crns } from "../../../test-data";

describe("backend/api/controllers/courses", function () {
  let app: Express;

  this.beforeAll(async () => {
    const apiImported = api();
    app = apiImported.app;
  });

  it("search has a default pagination limit", async function () {
    const resp = await request(app).get("/courses/").expect(200);
    expect(resp.body).to.have.lengthOf(COURSE_SEARCH_PAGINATION_LIMIT);
  });

  it("search pagination can be modified", async function () {
    const resp = await request(app).get("/courses/?limit=5").expect(200);
    expect(resp.body).to.have.lengthOf(5);
  });

  it("search pagination with very high page", async function () {
    const resp = await request(app).get("/courses/?page=10000").expect(200);
    expect(resp.body).to.have.lengthOf(0);
  });

  it("search pagination fails if past limit", async function () {
    const resp = await request(app).get("/courses/?limit=1000").expect(400);
    expect(resp.body.error).to.match(/invalid pagination/);
  });

  it("search with invalid pagination fields", async function () {
    const resp = await request(app).get("/courses/?limit=foo&page=bar").expect(400);
    expect(resp.body.error).to.match(/invalid pagination/);
  });

  it("search with invalid numerical values", async function () {
    const firstResp = await request(app).get("/courses/?semesterYear=NOT_A_YEAR").expect(400);
    expect(firstResp.body.error).to.match(/semesterYear wasn't a valid number/);

    const secondResp = await request(app).get("/courses/?beginTimeMin=wayTooEarlyForMeOmegaLUL").expect(400);
    expect(secondResp.body.error).to.match(/beginTimeMin wasn't a valid number/);
  });

  it("finding course with valid crn", async function () {
    await request(app).get(`/courses/${testSemester2Crns[1]}`).expect(200);
  });

  it("finding course with crn that won't be found", async function () {
    const resp = await request(app).get(`/courses/-1`).expect(404);
    expect(resp.body.error).to.match(/course not found/);
  });

  it("finding course with invalid crn", async function () {
    const resp = await request(app).get(`/courses/{blarg}`).expect(400);
    expect(resp.body.error).to.match(/crn wasn't a valid number/);
  });
});
