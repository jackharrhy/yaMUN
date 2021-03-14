import { expect } from "chai";
import { describe } from "mocha";

import { BadRequest } from "../../../src/backend/api/errors";
import User from "../../../src/backend/models/user";

describe("backend/models/user", function () {
  this.beforeEach(async () => {
    await User.deleteMany({});
  });

  it("create user", async function () {
    const username = "test";
    const user = await User.createUser(username, "long valid password");
    expect(user).property("username").to.equal(username);
    expect(user).not.to.have.property("password");
    expect(user).to.have.property("passwordHash");
  });

  it("create user and log in", async function () {
    const user = await User.createUser("test", "long valid password");
    const login = User.login("test", "long valid password");
    await expect(login).to.eventually.equal(user._id.toString());
  });

  it("login with wrong password", async function () {
    await User.createUser("test", "long valid password");
    const login = User.login("test", "wrongpass");
    await expect(login).to.eventually.equal(null);
  });

  it("login as non-existant user", async function () {
    const login = User.login("test", "long valid password");
    await expect(login).to.eventually.equal(null);
  });

  it("login as non-existant user", async function () {
    const login = User.login("test", "long valid password");
    await expect(login).to.eventually.equal(null);
  });

  it("create same user twice", async function () {
    await User.createUser("test", "long valid password");

    return expect(
      User.createUser("test", "anotherpass")
    ).to.eventually.be.rejectedWith(BadRequest, "username already exists");
  });

  it("create user with too short/long passwords", async function () {
    await expect(
      User.createUser("s", "short username")
    ).to.eventually.be.rejectedWith(BadRequest);
    await expect(
      User.createUser("fine username", "pas")
    ).to.eventually.be.rejectedWith(BadRequest);
    await expect(
      User.createUser("toolong".repeat(32), "valid password")
    ).to.eventually.be.rejectedWith(BadRequest);
    return expect(
      User.createUser("valid username", "toolong".repeat(64))
    ).to.eventually.be.rejectedWith(BadRequest);
  });
});
