import express from "express";
import coursesController from "./controllers/courses";
import schedulesController from "./controllers/schedules";
import usersController from "./controllers/users";

export default async ({ port = 4000 } = {}) => {
  const app = express();
  app.use(express.json());

  app.get("/courses/:crn", coursesController.courseByCrn);
  app.post("/users", usersController.create);

  app.get("/schedules/:scheduleId", schedulesController.get);
  app.post("/schedules", schedulesController.create);
  app.put("/schedules/:scheduleId/:crn", schedulesController.addCourse);
  app.delete("/schedules/:scheduleId/:crn", schedulesController.removeCourse);
  app.delete("/schedules/:scheduleId", schedulesController.delete);

  return {
    listen: () => {
      app.listen(port, () => {
        console.log(`server started at http://localhost:${port}`);
      });
    },
  };
};
