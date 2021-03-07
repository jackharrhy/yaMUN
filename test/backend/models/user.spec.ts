import { expect } from "chai";
import { describe } from "mocha";

import { BadRequest } from "../../../src/backend/api/errors";
import User from "../../../src/backend/models/user";

describe("backend/models/user", function () {
  this.beforeEach(async () => {
    await User.deleteMany({});
  });

  it("create user", async function () {
    const user = await User.createUser("test", "test");
    expect(user).property("username").to.equal("test");
    expect(user).not.to.have.property("password");
    expect(user).to.have.property("passwordHash");
  });

  it("create user and log in", async function () {
    const user = await User.createUser("test", "test");
    const login = User.login("test", "test");
    await expect(login).to.eventually.equal(user._id.toString());
  });

  it("login with wrong password", async function () {
    await User.createUser("test", "test");
    const login = User.login("test", "wrongpass");
    await expect(login).to.eventually.equal(null);
  });

  it("login as non-existant user", async function () {
    const login = User.login("test", "test");
    await expect(login).to.eventually.equal(null);
  });

  it("login as non-existant user", async function () {
    const login = User.login("test", "test");
    await expect(login).to.eventually.equal(null);
  });

  it("create same user twice", async function () {
    await User.createUser("test", "test");

    expect(
      User.createUser("test", "anotherpass")
    ).to.eventually.to.rejectedWith(BadRequest, "username already exists");
  });
});
