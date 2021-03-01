import express, { Express } from "express";

import coursesController from "./controllers/courses";
import schedulesController from "./controllers/schedules";
import usersController from "./controllers/users";
import bookmarksController from "./controllers/bookmarks";
import exportsController from "./controllers/exports";
import { errorHandlerMiddleware } from "./errors";

const defineRoutes = (app: Express) => {
  // courses
  app.get("/courses", coursesController.search);
  app.get("/courses/:crn", coursesController.courseByCrn);

  // users
  app.post("/users", usersController.create);

  // schedules
  app.post("/schedules", schedulesController.create);
  app.get("/schedules/:scheduleId", schedulesController.get);
  app.put("/schedules/:scheduleId/:crn", schedulesController.addCourse);
  app.delete("/schedules/:scheduleId/:crn", schedulesController.removeCourse);
  app.delete("/schedules/:scheduleId", schedulesController.delete);

  // bookmarks
  app.get("/bookmarks/courses", bookmarksController.getCourseBookmarks);
  app.put("/bookmarks/courses/:crn", bookmarksController.addCourseBookmark);
  app.delete(
    "/bookmarks/courses/:crn",
    bookmarksController.deleteCourseBookmark
  );

  // exports
  app.get("/export/schedules/:scheduleId/ics", exportsController.scheduleToICS);
};

export default ({ port = 4000 } = {}) => {
  const app = express();
  app.use(express.json());
  defineRoutes(app);
  app.use(errorHandlerMiddleware);

  return {
    app,
    listen: () => {
      app.listen(port, () => {
        console.log(`server started at http://localhost:${port}`);
      });
    },
  };
};
