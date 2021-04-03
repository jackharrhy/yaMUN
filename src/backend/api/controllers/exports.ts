import debugFactory from "debug";
import eol from "eol";
import express from "express";
import { createEvents, DateArray, EventAttributes } from "ics";
import { RRule, ByWeekday } from "rrule";

import Course, { ICourse } from "../../models/course";
import Schedule, { IScheduleDocument } from "../../models/schedule";
import { expectUserId } from "../auth";
import { BadRequest, Forbidden } from "../errors";
import { stringToObjectId, stringToNumber } from "../utils";

const debug = debugFactory("backend/api/controllers/exports");

const rruleMap: any = {
  M: 0,
  T: 1,
  W: 2,
  R: 3,
  F: 4,
  S: 5,
  U: 6,
};

const exportsController = {
  async scheduleToICS(req: express.Request, res: express.Response) {
    const userId = await expectUserId(req);
    const scheduleId = stringToObjectId(req.params.scheduleId, "scheduleId");

    const startDateYear = stringToNumber(
      req.query.startYear?.toString(),
      "startYear"
    );

    const startDateMonth = stringToNumber(
      req.query.startMonth?.toString(),
      "startMonth"
    );

    const startDateDay = stringToNumber(
      req.query.startDay?.toString(),
      "startDay"
    );

    const endDateYear = stringToNumber(
      req.query.endYear?.toString(),
      "endYear"
    );

    const endDateMonth = stringToNumber(
      req.query.endMonth?.toString(),
      "endMonth"
    );

    const endDateDay = stringToNumber(req.query.endDay?.toString(), "endDay");

    const schedule: IScheduleDocument | null = await Schedule.findById(
      scheduleId
    ).exec();

    if (schedule === null || !schedule?.owner.equals(userId)) {
      throw new Forbidden("not authorized");
    }

    const events: EventAttributes[] = [];

    await Promise.all(
      schedule.courses.map(async (courseSid) => {
        const course: ICourse | null = await Course.findOneBySid(courseSid);

        if (course === null) {
          throw new BadRequest(
            `can't export schedule with missing course, found invalid sid '${courseSid}'`
          );
        }

        course.sections.forEach((curSection) => {
          curSection.slots.forEach((curSlot) => {
            if (curSlot.endTime === null || curSlot.beginTime === null) {
              curSlot.beginTime = 1200;
              curSlot.endTime = 1201;
            }
            const startDate: DateArray = [
              startDateYear,
              startDateMonth,
              startDateDay,
              Math.round(curSlot.beginTime / 100),
              Math.round(curSlot.beginTime % 100)
            ];
            const endDate: DateArray = [endDateYear, endDateMonth, endDateDay, Math.round(curSlot.endTime / 100), Math.round(curSlot.endTime % 100)];

            const duration = curSlot.endTime - curSlot.beginTime;

            let hours = Math.round(duration / 100);
            let minutes = Math.round(duration % 100);

            if (minutes >= 60) {
              hours++;
              minutes -= 60;
            }

            const mappedDays: ByWeekday[] = curSlot.days.map(
              (day) => rruleMap[day]
            );

            const rule = new RRule({
              freq: RRule.WEEKLY,
              byweekday: mappedDays,
              until: new Date(
                endDate[0],
                endDate[1],
                endDate[2],
                endDate[3],
                endDate[4]
              ),
            });
            events.push({
              start: startDate,
              title: course.name.concat(" - ", curSection.section), // CHECK CONCATENATE
              location: curSlot.room ?? undefined,
              recurrenceRule: rule.toString().replace("RRULE:", ""),
              duration: {
                hours: hours,
                minutes: minutes,
              },
            });
          });
        });
      })
    );

    createEvents(events, (error, value) => {
      if (error) throw new Error();

      // Filter everything but alphanumeric characters and _ to prevent header injection
      const scheduleName = schedule.title.replace(/\W/g, "");

      res.set({
        "Content-Disposition": `attachment; filename="${scheduleName}.ics"`,
      });
      res.status(200).send(eol.crlf(value));
    });
  },
};

export default exportsController;
