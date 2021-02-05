export const COURSE_REGEX = /^(?<subject>([A-Z]|&|\.| ){4}) (?<number>(\d|[A-Z]){4}) (?<name>.{27})/;

export const SECTION_REGEX = /^.{37} (?<section>(\d|[A-Z]){3}) (?<crn>\d{5}) .{38}((?<scheduleType>([A-Z]|&){3})|   )   .{11} (?<phoneOne>Y|N|D|A) (?<phoneTwo>Y|N|D|A)  (?<waitList>Y|N)   (?<preCheck>Y|N)    ((?<reserved>Y|N|D)| )   (?<attr>(L|Q|W|G|R| ){5}) (?<creditHours>( |\d){3})  (?<billedHours>(( |\d){3})| NA)  ((Primary - (?<primaryInstructor>[A-Z] (\w| ){11}) ((?<secondaryInstructor>[A-Z] (\w| ){11})))|.*)/;

export const SLOT_REGEX = /^.{48}(?<slot>( |\d|[A-Z]){4}) (?<days>(M| ) (T| ) (W| ) (R| ) (F| ) (S| ) (U| )) ((?<beginTime>\d{4})|    ) ((?<endTime>\d{4})|   ) ((?<room>(([A-Z]  )|([A-Z]{2} )|([A-Z]{3}))((\d){4}([A-Z])?))|)/;

export const LAB_SECTION_REGEX = /^.{92}(?<associatedLabSections>(\d{3}) (\d{3}|( ){3}) (\d{3}|( ){3}))/;
