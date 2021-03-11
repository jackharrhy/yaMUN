import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import express, { Express } from "express";
import session from "express-session";

import { PORT, SESSION_SECRET } from "../config";
import { database } from "../database";
import bookmarksController from "./controllers/bookmarks";
import courseInfoController from "./controllers/course-info";
import coursesController from "./controllers/courses";
import exportsController from "./controllers/exports";
import peopleController from "./controllers/people";
import schedulesController from "./controllers/schedules";
import usersController from "./controllers/users";
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
  // courses - searching for courses by query param filters, and finding specific courses by crn
  app.get("/courses", acw(coursesController.search));
  app.get("/courses/:crn", acw(coursesController.courseByCrn));

  // people - getting more information regarding professors who teach courses
  app.get("/people", acw(peopleController.search));

  // course-info - getting more information regarding courses
  app.get("/course-info/:subject/:number", acw(courseInfoController.course));
  app.get("/course-info/:subject", acw(courseInfoController.allCoursesOfSubject));

  // users - endpoints for creating users, users knowing their username when logged in,
  // and the ability for users to log in and out
  app.get("/users", acw(usersController.getInfoAboutSelf));
  app.post("/users", acw(usersController.create));
  app.post("/login", acw(usersController.login));
  app.get("/logout", acw(usersController.logout));

  // schedules - endpoints for users to create, modify, view, and delete their
  // potentially many schedules, and to access other peoples schedules
  app.post("/schedules", acw(schedulesController.create));
  app.get("/schedules/:scheduleId", acw(schedulesController.getById));
  app.put("/schedules/:scheduleId", acw(schedulesController.updateMeta));
  app.put("/schedules/:scheduleId/:crn", acw(schedulesController.addCourse));
  app.delete(
    "/schedules/:scheduleId/:crn",
    acw(schedulesController.removeCourse)
  );
  app.delete("/schedules/:scheduleId", acw(schedulesController.delete));

  // bookmarks - endpoints for viewing, adding, and removing course bookmarks
  app.get("/bookmarks/courses", acw(bookmarksController.getCourseBookmarks));
  app.put(
    "/bookmarks/courses/:crn",
    acw(bookmarksController.addCourseBookmark)
  );
  app.delete(
    "/bookmarks/courses/:crn",
    acw(bookmarksController.deleteCourseBookmark)
  );

  // exports - currently jsut exporting to ics, work in progress
  app.get(
    "/export/schedules/:scheduleId/ics",
    acw(exportsController.scheduleToICS)
  );
};

export default () => {
  const app = express();

  app.use(express.json());

  app.use(cookieParser());

  app.use(
    session({
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        clientPromise: Promise.resolve(database.getClient()),
      }),
    })
  );

  defineRoutes(app);

  app.use(errorHandlerMiddleware);

  return {
    app,
    listen: () => {
      app.listen(PORT, () => {
        console.log(`server started at http://localhost:${PORT}`);
      });
    },
  };
};
