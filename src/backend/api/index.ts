import express, { Express } from "express";

import coursesController from "./controllers/courses";
import schedulesController from "./controllers/schedules";
import usersController from "./controllers/users";
import bookmarksController from "./controllers/bookmarks";
import exportsController from "./controllers/exports";
import { errorHandlerMiddleware } from "./errors";

const asyncCatchWrapper = (
  handler: (req: express.Request, res: express.Response) => Promise<void>
) => (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  handler(req, res).catch(next);
};

const acw = asyncCatchWrapper;

const defineRoutes = (app: Express) => {
  // courses
  app.get("/courses", acw(coursesController.search));
  app.get("/courses/:crn", acw(coursesController.courseByCrn));

  // users
  app.post("/users", acw(usersController.create));

  // schedules
  app.post("/schedules", acw(schedulesController.create));
  app.get("/schedules/:scheduleId", acw(schedulesController.getById));
  app.put("/schedules/:scheduleId/:crn", acw(schedulesController.addCourse));
  app.delete(
    "/schedules/:scheduleId/:crn",
    acw(schedulesController.removeCourse)
  );
  app.delete("/schedules/:scheduleId", acw(schedulesController.delete));

  // bookmarks
  app.get("/bookmarks/courses", acw(bookmarksController.getCourseBookmarks));
  app.put(
    "/bookmarks/courses/:crn",
    acw(bookmarksController.addCourseBookmark)
  );
  app.delete(
    "/bookmarks/courses/:crn",
    acw(bookmarksController.deleteCourseBookmark)
  );

  // exports
  app.get(
    "/export/schedules/:scheduleId/ics",
    acw(exportsController.scheduleToICS)
  );
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
