import { expect, describe, it } from "vitest";

import {
  getCoursesFromSemester,
  getListingsBySectionNo,
  getPeopleData,
  LISTINGS,
} from "../src/";

describe.concurrent("tests", () => {
  it("returns people data", async () => {
    const peopleData = await getPeopleData();
    expect(peopleData).not.toBeUndefined;
    expect(peopleData).not.toBeNull;
  }, 10000);

  it("returns calendar data", async () => {
    const listings = await getListingsBySectionNo(LISTINGS.COMP[0], "COMP");
    expect(listings).not.toBeUndefined;
    expect(listings).not.toBeNull;
  });

  it("returns banner data", async () => {
    const courses = await getCoursesFromSemester({
      year: 2021,
      term: 2,
      level: 1,
    });
    expect(courses).not.toBeUndefined;
    expect(courses).not.toBeNull;
  });
});
