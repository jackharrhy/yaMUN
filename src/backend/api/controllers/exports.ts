import debugFactory from "debug";
import express from "express";
import ics, { DateArray, EventAttributes } from "ics";
import { RRule, Weekday } from 'rrule';

import Section, { ISection } from "../../models/section";
import Course, { ICourse } from "../../models/course";
import Schedule, { IScheduleDocument } from "../../models/schedule";
import { ISlot } from "../../models/slot";
const { writeFileSync } = require('fs')

const debug = debugFactory("backend/api/controllers/exports");

const rruleMap: { [day: string] : any } = {
  "Monday": RRule.MO,
  "Tuesday": RRule.TU,
  "Wednesday": RRule.WE,
  "Thursday": RRule.TH,
  "Friday": RRule.FR,
  "Saturday": RRule.SA,
  "Sunday": RRule.SU
};

const exportsController = {
  async scheduleToICS(req: express.Request, res: express.Response) {
    const scheduleId = req.params.scheduleId;

    const schedule: IScheduleDocument | null = await Schedule.findById(
      scheduleId
    ).exec();

    let events: EventAttributes[] = [];
    let crns = schedule?.courses;
    let crnsLength = Number(crns?.length);
    let semester = schedule?.semester;

    for (let i = 0; i <= crnsLength; i++) {
      let course: ICourse | null = await Course.findOneByCrn(crns![i]);
      let section: ISection | null = await Section.findOneByCrn(crns![i]);
      let slots: ISlot[] | null = section!.slots;
      let startYear = semester!.year;
      let startDate: DateArray = [startYear, 9, 2, 11, 0];
      let endDate: DateArray = [startYear+1, 4, 15, 16, 0];
      for (let j = 0; j <= Number(slots?.length); j++) {
        let currSlot = slots![j];
        let days = currSlot.days;
        let duration = currSlot.endTime! - currSlot.beginTime!;
        let mappedDays: Weekday[] = [];
        for (let k = 0; k <= days.length; k++) {
          mappedDays.push(rruleMap[days[k]]);
        }
        const rule = new RRule({
          byweekday: mappedDays,
          dtstart: new Date(startDate[0], startDate[1], startDate[2], startDate[3], startDate[4]),
          until: new Date(endDate[0], endDate[1], endDate[2], endDate[3], endDate[4])
        })
        let event = {
          start: startDate,
          title: course!.name.concat("-", section!.section), //CHECK CONCATENATE
          location: slots![j].room!,
          reccurence: rule.toString(),
          duration: duration
        };
        events.push(event);
      }  
    }

    ics.createEvents(events, (error, value) => {
      if (error) {
        console.log(error)
        return
      }
      let file = writeFileSync(`${__dirname}/events.ics`, value);
      res.status(200).json(file);
    })
  },
};

export default exportsController;
