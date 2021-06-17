import { JSONSchemaType } from "ajv";
import fetch from "node-fetch";
import * as db from "zapatos/db";

import pool from "../../db/pool";
import { IPeople } from "../../types";
import ajv from "../../utils/ajv";
import { insertPeople } from "./insert";

export interface IPeopleApiResponse {
  results: {
    displayname: string;
    campus: string;
    department: string;
    lname: string;
    title: string;
    fname: string;
    extension: string;
    room: string;
    email: string;
  }[];
}

const peopleApiSchema: JSONSchemaType<IPeopleApiResponse> = {
  type: "object",
  properties: {
    results: {
      type: "array",
      items: {
        type: "object",
        properties: {
          displayname: { type: "string" },
          campus: { type: "string" },
          department: { type: "string" },
          lname: { type: "string" },
          title: { type: "string" },
          fname: { type: "string" },
          extension: { type: "string" },
          room: { type: "string" },
          email: { type: "string" },
        },
        required: [
          "displayname",
          "campus",
          "department",
          "lname",
          "title",
          "fname",
          "extension",
          "room",
          "email",
        ],
        additionalProperties: false,
      },
    },
  },
  required: ["results"],
  additionalProperties: true,
};

const PEOPLE_API =
  "https://www.mun.ca/appinclude/bedrock/public/api/v1/ua/people.php?type=advanced&nopage=1";

const HEADERS = {
  "User-Agent": "github.com/jackharrhy/yamun - src/backend/scrape/people",
};

export const fetchPeopleData = async (): Promise<any> => {
  const response = await fetch(PEOPLE_API, { headers: HEADERS });
  return await response.json();
};

export const parsePeopleData = (data: any): IPeopleApiResponse => {
  const validate = ajv.compile(peopleApiSchema);
  if (validate(data)) {
    return data;
  } else {
    const errorsAsString = JSON.stringify(validate.errors, null, 2);
    throw new Error(errorsAsString);
  }
};

export const convertPeopleData = (
  peopleApiResponse: IPeopleApiResponse
): IPeople[] => {
  return peopleApiResponse.results.map((apiResp) => {
    const bannerName = `${apiResp.fname?.[0]} ${apiResp.fname}`;

    return {
      bannerName,
      displayName: apiResp.displayname,
      campus: { name: apiResp.campus },
      department: { name: apiResp.department },
      title: apiResp.title,
      firstName: apiResp.fname,
      lastName: apiResp.lname,
      extension: apiResp.extension,
      location: apiResp.room,
      email: apiResp.email,
    };
  });
};

export const populatePeople = async () => {
  const peopleCount = await db.count("people", db.all).run(pool);

  if (peopleCount === 0) {
    console.log("populating people...");
    const peopleApiResponse = await fetchPeopleData();
    const parsed = parsePeopleData(peopleApiResponse);
    const people = await convertPeopleData(parsed);
    console.log(`inserting ${people.length} people`);
    await insertPeople(people);
    console.log("populated people!");
  } else {
    console.log("no need to populate people, already existing data");
  }
};
