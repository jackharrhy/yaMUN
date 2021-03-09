import { expect } from "chai";
import { Express } from "express";
import { describe } from "mocha";
import request from "supertest";

import api from "../../../../src/backend/api";

describe("backend/api/controllers/people", function () {
  let app: Express;

  this.beforeAll(async () => {
    const apiImported = api();
    app = apiImported.app;
  });

  it("returns users when given correct query param", async function () {
    const firstResp = await request(app)
      .get("/people/?nameInBanner=M Bartha")
      .expect(200);
    expect(firstResp.body).to.have.lengthOf(1);
    const secondResp = await request(app)
      .get("/people/?nameInBanner=M Hebert")
      .expect(200);
    expect(secondResp.body).to.have.lengthOf(1);
  });

  it("returns no users when given correct query param, but no users found", async function () {
    const firstResp = await request(app)
      .get("/people/?nameInBanner=V alidButNotFound")
      .expect(200);
    expect(firstResp.body).to.have.lengthOf(0);
    const secondResp = await request(app)
      .get("/people/?nameInBanner=I WillNotBeFound")
      .expect(200);
    expect(secondResp.body).to.have.lengthOf(0);
  });

  it("fails on invalid values for nameInBanner query param", async function () {
    await request(app).get("/people/").expect(400);
    await request(app).get("/people/?myNameIsJeff").expect(400);
    await request(app).get("/people/?nameInBanner=").expect(400);
    await request(app).get("/people/?nameInBanner=Invalid Name").expect(400);
    await request(app).get("/people/?nameInBanner=I nvalid Name").expect(400);
    await request(app)
      .get("/people/?nameInBanner=not a valid name")
      .expect(400);
  });
});
