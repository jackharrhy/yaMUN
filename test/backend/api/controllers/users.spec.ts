import { expect } from "chai";
import { Express } from "express";
import { describe } from "mocha";
import request from "supertest";

import api from "../../../../src/backend/api";
import User from "../../../../src/backend/models/user";

describe("backend/api/controllers/users", function () {
  let app: Express;

  this.beforeAll(async () => {
    const apiImported = api();
    app = apiImported.app;
  });

  this.beforeEach(async () => {
    await User.deleteMany({});
  });

  it("forbidden on requesting info about self without a session", async function () {
    const resp = await request(app).get("/users").expect(403);
    expect(resp.body.error).to.match(/requires authentication/);
  });
});
