import { expect } from "chai";
import { describe } from "mocha";

import { BadRequest } from "../../../src/backend/api/errors";
import People from "../../../src/backend/models/people";

describe("backend/models/people", function () {
  it("find people by nameInBanner", async function () {
    const people = await People.findByBannerName("M Bartha");
    expect(people).to.have.lengthOf(1);
    expect(people?.[0].firstName).to.equal("Miklos");
  });

  it("find people that won't be found by nameInBanner", async function () {
    const people = await People.findByBannerName("W ontBeFound");
    expect(people).to.have.lengthOf(0);
  });

  it("invalid nameInBanner seperated by too many spaces", async function () {
    const people = People.findByBannerName("Too Many Spaces");
    return expect(people).to.be.eventually.rejectedWith(
      BadRequest,
      "expected nameInBanner to contain only two words, seperated by space"
    );
  });

  it("invalid nameInBanner with first word more than one character", async function () {
    const people = People.findByBannerName("Long FirstWord");
    return expect(people).to.be.eventually.rejectedWith(
      BadRequest,
      "expected first word in nameInBanner to have a length of 1"
    );
  });
});
