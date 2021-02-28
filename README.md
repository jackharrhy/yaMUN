# COMP 3100

## Members

- [jackharrhy](https://github.com/jackharrhy)
- [Mudkip](https://github.com/mudkip)
- [AidanLanger](https://github.com/aidanlanger)

## Routes

### Courses

Courses themselves, with all data embedded.

- `GET /courses/` - Get all courses.

#### Query params

##### Pagination

- page - `number`
- limit - `number`

##### Filtering

- semesterYear - `number`
- semesterTerm - `number`
- semesterLevel - `number`
- number - `string`
- subject - `string`
- name - `string`
- prof - `string`
- days - `string[]`
- beginTimeMin - `number`
- beginTimeMax - `number`
- endTimeMin - `number`
- endTimeMax - `number`

##### Other

- include - `string[]` - Fields to fetch, rather than all fields, for a condensed view.

- `GET /courses/:crn` - Get course by its crn

### Schedule

A saved list of courses users can keep to track what they wish to take.

- `GET /schedules/:scheduleId` - Get schedule by id.
- `PUT /schedules/:scheduleId/courses/:crn` - Add course to user schedule.
- `DELETE /schedules/:scheduleId/courses/:crn` - Remove course from user schedule.
- `DELETE /schedules/:scheduleId` - Remove schedule itself.

### Bookmarks

Quick way of bookmarking entities in the application.

- `GET /bookmarks/courses` - Get bookmarked courses of the currently authenticated user.
- `PUT /bookmarks/courses/:crn` - Add course to bookmarks of the above.
- `DELETE /bookmarks/courses/:crn` - Remove course from booksmarks of the above.

### Export

- `GET /export/schedules/:scheduleId/ics` - Export [ics](https://en.wikipedia.org/wiki/ICalendar) file for a given schedule.
