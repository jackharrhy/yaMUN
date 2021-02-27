import express from "express";
import coursesController from "./controllers/courses";
import schedulesController from "./controllers/schedules";
import usersController from "./controllers/users";

export default async ({ port = 4000 } = {}) => {
  const app = express();
  app.use(express.json());

  app.get("/courses/:crn", coursesController.courseByCrn);
  app.post("/users", usersController.create);
  app.post("/schedules", schedulesController.create);
  app.put("/schedules/:scheduleId/:crn", schedulesController.addCourse);

  return {
    listen: () => {
      app.listen(port, () => {
        console.log(`server started at http://localhost:${port}`);
      });
    },
  };
};
