import { JSDOM } from "jsdom";

import fetchData from "./fetch-data";

const LINE_PARSING_REGEX = /((?<subject>\w{4})|( {4})) ((?<courseNumber>\d{4})|( {4})) (?<courseName>.{27}) (?<section>\d{3}) (?<crn>\d{5}) (((?<slot>\d{2}  ))|( {4})) (?<daysOfTheWeek>(M| ) (T| ) (W| ) (R| ) (F| ) (S| ) (U| )) (?<beginTime>\d{4}) (?<endTime>\d{4}) (?<room>([A-Z]  )|([A-Z]{2} )|([A-Z]{3}))((\d){4}([A-Z])?)  (?<type>([A-Z]|&){3})              (?<phone> (?<one>Y|N) (?<two>Y|N))  (?<waitlist>Y|N)   (?<preCheck>Y|N)                (?<creditHours>\d)    (?<billHours>\d)  (?<instructor>Primary - (?<primary>[A-Z] \w*))/gm;

const parseData = (data: string) => {
  const dom = new JSDOM(data);
  const pre = dom.window.document.querySelector("pre");

  let campus = null;
  let session = null;
  let subject = null;

  let counter = 0;
  for (const line of pre.textContent.split("\n")) {
    const trimmed = line.trim();
    counter++;
    if (counter > 50) break;

    if (trimmed.startsWith("Campus: ")) {
      campus = trimmed.slice("Campus: ".length);
      continue;
    }

    if (trimmed.startsWith("Session: ")) {
      session = trimmed.slice("Session: ".length);
      continue;
    }

    if (trimmed.startsWith("Subject: ")) {
      subject = trimmed.slice("Subject: ".length);
      continue;
    }

    const match = LINE_PARSING_REGEX.exec(line);
    console.log({ match, line });
  }
};

export const tempInvoke = async () => {
  const testData = await fetchData(2020, 2, 1);
  parseData(testData);
};
