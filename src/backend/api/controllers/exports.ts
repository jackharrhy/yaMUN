import debugFactory from "debug";
import eol from "eol";
import express from "express";
import { createEvents, DateArray, EventAttributes } from "ics";
import { RRule, ByWeekday } from "rrule";

import Course, { ICourse } from "../../models/course";
import Schedule, { IScheduleDocument } from "../../models/schedule";
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
    const scheduleId = stringToObjectId(req.params.scheduleId, "scheduleId");

    const schedule: IScheduleDocument | null = await Schedule.findById(
      scheduleId
    ).exec();

    // TODO access control!

    if (schedule === null) {
      throw new Forbidden("not authorized");
    }

    let events: EventAttributes[] = [];

    let semester = schedule.semester;
    let startYear = semester.year;
    let startDate: DateArray = [startYear, 9, 2, 11, 0]; // NEEDS TO BE CHANGED TO USER INPUT
    let endDate: DateArray = [startYear + 1, 4, 15, 16, 0];

    await Promise.all(
      schedule.courses.map(async (courseCrn) => {
        const course: ICourse | null = await Course.findOneByCrn(courseCrn);

        if (course === null) {
          // TODO maybe handle this by throwing?
          return;
        }

        course.sections.forEach((curSection) => {
          curSection.slots.forEach((curSlot) => {
            if (curSlot.endTime === null || curSlot.beginTime === null) {
              return;
            }

            const duration = curSlot.endTime - curSlot.beginTime;

            const mappedDays: ByWeekday[] = curSlot.days.map(
              (day) => rruleMap[day]
            );

            const rule = new RRule({
              freq: RRule.WEEKLY,
              byweekday: mappedDays,
              dtstart: new Date(
                startDate[0],
                startDate[1],
                startDate[2],
                startDate[3],
                startDate[4]
              ),
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
              recurrenceRule: rule.toString(),
              duration: {
                hours: Math.round(duration / 100),
                minutes: Math.round(duration % 100),
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
