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

const defineRoutes = (app: Express) => {
  // courses
  app.get("/courses", asyncCatchWrapper(coursesController.search));
  app.get("/courses/:crn", asyncCatchWrapper(coursesController.courseByCrn));

  // users
  app.post("/users", asyncCatchWrapper(usersController.create));

  // schedules
  app.post("/schedules", asyncCatchWrapper(schedulesController.create));
  app.get("/schedules/:scheduleId", asyncCatchWrapper(schedulesController.get));
  app.put(
    "/schedules/:scheduleId/:crn",
    asyncCatchWrapper(schedulesController.addCourse)
  );
  app.delete(
    "/schedules/:scheduleId/:crn",
    asyncCatchWrapper(schedulesController.removeCourse)
  );
  app.delete(
    "/schedules/:scheduleId",
    asyncCatchWrapper(schedulesController.delete)
  );

  // bookmarks
  app.get(
    "/bookmarks/courses",
    asyncCatchWrapper(bookmarksController.getCourseBookmarks)
  );
  app.put(
    "/bookmarks/courses/:crn",
    asyncCatchWrapper(bookmarksController.addCourseBookmark)
  );
  app.delete(
    "/bookmarks/courses/:crn",
    asyncCatchWrapper(bookmarksController.deleteCourseBookmark)
  );

  // exports
  app.get(
    "/export/schedules/:scheduleId/ics",
    asyncCatchWrapper(exportsController.scheduleToICS)
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
