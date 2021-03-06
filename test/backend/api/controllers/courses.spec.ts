import { expect } from "chai";
import { Express } from "express";
import { describe } from "mocha";
import request from "supertest";

import api from "../../../../src/backend/api";
import { COURSE_SEARCH_PAGINATION_LIMIT } from "../../../../src/backend/api/controllers/courses";

describe("backend/api/controllers/courses", function () {
  let app: Express;

  this.beforeAll(async () => {
    const apiImported = api();
    app = apiImported.app;
  });

  describe("search", function () {
    it("has a pagination limit", async function () {
      const resp = await request(app).get("/courses/").expect(200);
      expect(resp.body).to.have.lengthOf(COURSE_SEARCH_PAGINATION_LIMIT);
    });
  });
});
