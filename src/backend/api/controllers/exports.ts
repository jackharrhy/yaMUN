import debugFactory from "debug";
import eol from "eol";
import express from "express";
import { createEvents, DateArray, EventAttributes } from "ics";
import { RRule, ByWeekday } from "rrule";

import Course, { ICourse } from "../../models/course";
import Schedule, { IScheduleDocument } from "../../models/schedule";
import { expectUserId } from "../auth";
import { Forbidden } from "../errors";
import { stringToObjectId } from "../utils";

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

    const schedule: IScheduleDocument | null = await Schedule.findById(
      scheduleId
    ).exec();

    if (schedule === null || !schedule?.owner.equals(userId)) {
      throw new Forbidden("not authorized");
    }

    const events: EventAttributes[] = [];

    const semester = schedule.semester;
    const startYear = semester.year;
    const startDate: DateArray = [startYear, 9, 2, 11, 0]; // NEEDS TO BE CHANGED TO USER INPUT
    const endDate: DateArray = [startYear + 1, 4, 15, 16, 0];

    await Promise.all(
      schedule.courses.map(async (courseCrn) => {
        const course: ICourse | null = await Course.findOneByCrn(courseCrn);

        if (course === null) {
          throw new Error();
        }

        course.sections.forEach((curSection) => {
          curSection.slots.forEach((curSlot) => {
            if (curSlot.endTime === null || curSlot.beginTime === null) {
              curSlot.beginTime = 1200;
              curSlot.endTime = 1201;
            }

            const duration = curSlot.endTime - curSlot.beginTime;

            var hours = Math.round(duration / 100);
            var minutes = Math.round(duration % 100);
            if (minutes >= 60) { hours++; minutes -= 60; }

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
              title: course.name.concat("-", curSection.section), // CHECK CONCATENATE
              location: curSlot.room ?? undefined,
              recurrenceRule: rule.toString().replace("RRULE:", ''),
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
      res.set({ "Content-Disposition": 'attachment; filename="schedule.ics"' });
      res.status(200).send(eol.crlf(value));
    });
  },
};

export default exportsController;
