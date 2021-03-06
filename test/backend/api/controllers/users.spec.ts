import { expect } from "chai";
import { Express } from "express";
import { describe } from "mocha";
import request, { SuperAgentTest } from "supertest";

import api from "../../../../src/backend/api";
import User from "../../../../src/backend/models/user";
import { dropCollection } from "../../../test-utils";

describe.only("backend/api/controllers/users", function () {
  let app: Express;
  let agent: SuperAgentTest;

  this.beforeAll(async () => {
    const apiImported = api();
    app = apiImported.app;
  });

  this.beforeEach(async () => {
    await User.deleteMany({});
    await dropCollection("sessions");
    agent = request.agent(app);
  });

  it("creates user, logs in, and returns data about self", async function () {
    const username = "johndoe";

    await agent.post("/users").send({ username, password: "test" }).expect(204);
    await agent.post("/login").send({ username, password: "test" }).expect(204);

    const resp = await agent.get("/users").expect(200);
    expect(resp.body.username).to.equal(username);
  });

  it("can't create same user twice", async function () {
    const username = "johndoe";
    await agent.post("/users").send({ username, password: "test" }).expect(204);

    const resp = await agent
      .post("/users")
      .send({ username, password: "diff password" })
      .expect(400);

    expect(resp.body.error).to.match(/username already exists/);
  });

  it("can't login to user that doesn't exist", async function () {
    const resp = await agent
      .post("/login")
      .send({ username: "invalid", password: "test" })
      .expect(403);

    expect(resp.body.error).to.match(/incorrect password/);
  });

  it("can't login to user with wrong password", async function () {
    const username = "johndoe";
    await agent.post("/users").send({ username, password: "test" }).expect(204);

    const resp = await agent
      .post("/login")
      .send({ username, password: "diff password" })
      .expect(403);

    expect(resp.body.error).to.match(/incorrect password/);
  });

  it("forbidden on logout if logged out, and getting info about self", async function () {
    await agent.post("/users").send({ username: "test", password: "test" });
    await agent.post("/login").send({ username: "test", password: "test" });
    await agent.get("/users").expect(200);

    await agent.get(`/logout`).expect(204);

    await agent.get("/users").expect(403);
    await agent.get("/logout").expect(403);
  });
});
