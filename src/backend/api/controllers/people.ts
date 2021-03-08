import debugFactory from "debug";
import express from "express";

import People from "../../models/people";
import { NotFoundError, BadRequest } from "../errors";

const debug = debugFactory("backend/api/controllers/people");

const peopleController = {
  async search(req: express.Request, res: express.Response) {
    const nameInBanner = req.query.nameInBanner;
    debug("search", nameInBanner);

    if (nameInBanner === undefined) {
      throw new BadRequest("expected nameInBanner query param to be defined");
    }

    const nameInBannerAlphanumeric = nameInBanner
      .toString()
      .replace(/[^a-z0-9\s]/gi, "");

    const people = await People.findByBannerName(nameInBannerAlphanumeric);

    if (people === null) {
      throw new NotFoundError("person not found");
    } else {
      res.json(people);
    }
  },
};

export default peopleController;
