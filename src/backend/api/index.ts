import express from "express";
import coursesController from "./controllers/courses";

export default async ({ port = 4000 } = {}) => {
  const app = express();

  app.get("/courses/:crn", coursesController.courseByCrn);

  return {
    listen: () => {
      app.listen(port, () => {
        console.log(`server started at http://localhost:${port}`);
      });
    },
  };
};
