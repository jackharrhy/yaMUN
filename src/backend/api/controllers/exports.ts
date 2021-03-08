import debugFactory from "debug";
import express from "express";
import ics, { DateArray, EventAttributes } from 'ics';
import { RRule, ByWeekday } from 'rrule';

import Course, { ICourse } from "../../models/course";
import Schedule, { IScheduleDocument } from "../../models/schedule";
import { ISlot } from "../../models/slot";
import{ writeFileSync } from 'fs';

const debug = debugFactory("backend/api/controllers/exports");

let rruleMap: any = {
  'Monday': 0,
  'Tuesday': 1,
  'Wednesday': 2,
  'Thursday': 3,
  'Friday': 4,
  'Saturday': 5,
  'Sunday': 6
};

const exportsController = {
  async scheduleToICS(req: express.Request, res: express.Response) {
    const scheduleId = req.params.scheduleId;

    const schedule: IScheduleDocument | null = await Schedule.findById(
      scheduleId
    ).exec();

    let events: EventAttributes[] = [];
    let crns = schedule!.courses;
    let crnsLength = Number(crns!.length -1);
    let semester = schedule!.semester;
    let startYear = semester!.year;
    let startDate: DateArray = [startYear, 9, 2, 11, 0]; //NEEDS TO BE CHANGED TO USER INPUT
    let endDate: DateArray = [startYear+1, 4, 15, 16, 0];

    for (let i = 0; i <= crnsLength; i++) {
      const course: ICourse | null = await Course.findOneByCrn(crns![i]);
      let sections = course!.sections;
      for (let j = 0; j <= Number(sections.length -1); j++) {
        let currSection = sections[j];
        let slots: ISlot[] = currSection.slots;
        for (let j = 0; j <= Number(slots.length -1); j++) {
          let currSlot = slots[j];
          let days = currSlot.days;
          let duration = currSlot.endTime! - currSlot.beginTime!;
          let mappedDays: ByWeekday[] = [];
          for (let k = 0; k <= days.length -1; k++) {
            mappedDays.push(rruleMap[days[k]]);
          }
          const rule = new RRule({
            byweekday: mappedDays,
            dtstart: new Date(startDate[0], startDate[1], startDate[2], startDate[3], startDate[4]),
            until: new Date(endDate[0], endDate[1], endDate[2], endDate[3], endDate[4])
          })
          let event = {
            start: startDate,
            title: course!.name.concat("-", currSection!.section), //CHECK CONCATENATE
            location: slots![j].room!,
            reccurence: rule.toString(),
            duration: { hours: duration/100, minutes: duration%100 }
          };
          events.push(event);
        }
      }  
    }

    ics.createEvents(events, (error, value) => {
      if (error) {
        console.log(error)
        return
      }
      let file = writeFileSync(`${__dirname}/${events}.ics`, value);
      res.status(200).json(file);
    })
  },
};

export default exportsController;
