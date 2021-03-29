import { createSID } from "../src/backend/models/section";
import { ISemester } from "../src/backend/models/semester";

export const fakeUniCalPage1Dept = "COMP";

export const fakeUniCalPage1 = `
<div class="course">
   <p class="courseNumber">
      3100
   </p>
   <p class="courseTitle">
      Web Programming
   </p>
   <div class="courseDesc">
      <p class="inlinePara">
         studies the Web information system from a programming perspective. It teaches how Web data are transferred across the network, how to design interactive browser contents, and how to provide dynamic pages from the server.
      </p>
   </div>
   <p class="courseAttrs">
      CR: the former COMP 3715
   </p>
   <p class="courseAttrs">
      PR: COMP <a class="clink" style="color:red;" onclick="showcourse('SCI-3893', event, this);">2006</a>, COMP <a class="clink" style="color:red;" onclick="showcourse('SCI-3894', event, this);">2007</a>
   </p>
</div>

<div class="course">
   <p class="courseNumber">
      2005
   </p>
   <p class="courseTitle">
      Software Engineering
   </p>
   <div class="courseDesc">
      <p class="inlinePara">
         introduces students to the different software process models, to project management and the software requirements engineering process, as well as to systems analysis and design as a problem-solving activity.
      </p>
   </div>
   <p class="courseAttrs">
      CR: the former COMP 3716
   </p>
   <p class="courseAttrs">
      PR: COMP <a class="clink" style="color:red;" onclick="showcourse('SCI-3888', event, this);">2001</a>
   </p>
</div>
`;

export const fakePeopleApiResp = {
  searchParameters: [],
  totalResults: 123123,
  results: [
    {
      displayname: "Bartha , Dr. Miklos",
      campus: "STJ",
      department: "Computer Science",
      lname: "Bartha",
      title: "Dr.",
      fname: "Miklos",
      extension: "864-2193",
      room: "EN2022A",
      email: "bartha@mun.ca",
    },
    {
      displayname: "Hebert , Dr. Mark",
      campus: "STJ",
      department: "Psychology",
      lname: "Hebert",
      title: "Dr.",
      fname: "Mark",
      extension: "864-3436",
      room: "SN3098",
      email: "mhebert@mun.ca",
    },
    {
      displayname: "Rayment , Mr. Michael",
      campus: "STJ",
      department: "Computer Science",
      lname: "Rayment",
      title: "Mr.",
      fname: "Michael",
      extension: "864-8711",
      room: "EN1060",
      email: "mtr@mun.ca",
    },
  ],
};

export const testSemester1: ISemester = {
  year: 2019,
  term: 2,
  level: 1,
};

export const testSemester1Crns = [60053, 90446];

export const testSemester1Sids = [
  createSID(testSemester1, testSemester1Crns[0]),
  createSID(testSemester1, testSemester1Crns[1]),
];

export const testSemester1Data = `
Level: Undergraduate

Campus: St. John's

Session: Full Term

                                                     *** DAYS ***  BEG  END          SCHED  ASSOC LAB/      WAIT PRE RESV       CRED BILL
                 COURSE               SEC CRN   SLOT M T W R F S U TIME TIME  ROOM   TYPE   LEC SECT   PHON LIST CHK LFTD ATTR   HR   HR  INSTRUCTOR
                 ------               --- ----- ---- ------------- ---- ---- ------- -----  ---------- ---- ---- --- ---- ----- ---- ---- ----------

Subject: Anthropology

ANTH 1031 Introduction to Anthropolog 001 81797 14   M   W         1530 1645 A  1046  LEC               Y Y  Y   N                3    3  Primary - K Gordon
                                      002 64527 19     T   R       1400 1515 C  3033  LEC               Y Y  Y   N                3    3  Primary - W Fife
                                      056 91100 31     T           1900 2130 C  2033  LEC               Y Y  Y   N                3    3  Primary - J Clark
ANTH 2220 Lab Society & Culture       001 92771 G26    T   R       1730 1845 A  2065  LEC               Y Y  Y   N                3    3  Primary - S Neilsen
                                          This will be video streamed from Labrador to St. John's and  Grenfell Campus.
ANTH 2413 Culture, Soc & Globalizatio 001 92013 13   M   W         1400 1515 A  2071  LEC               Y Y  Y   N                3    3  Primary - K Gordon
ANTH 2414 Aboriginal Peoples North Am 001 88820 10   M   W         0900 1015 SN 2105  LEC               Y Y  Y   N        W       3    3  Primary - C Tytelman
ANTH 2415 Anthropology of Food        001 92015 17     T   R       0900 1015 QC 4028  LEC               Y Y  Y   N                3    3  Primary - L Addison
ANTH 2416 Cultural Formations         001 90157 11   M   W         1030 1145 QC 4028  LEC               Y Y  Y   N                3    3  Primary - W Fife
ANTH 3050 Ecology And Culture         002 92870              F     0900 1200 QC 4001  SEM               Y Y  Y   N                3    3  Primary - L Addison
ANTH 3054 Play,Games and Sport        001 88337 18     T   R       1030 1145 QC 4028  SEM               Y Y  Y   N                3    3  Primary - W Fife
ANTH 3061 Cult & Social Inequality    001 92019 54         R       1200 1450 QC 4001  SEM               Y Y  Y   N                3    3  Primary - J Clark
ANTH 3408 Engaged Anthropology        001 92683 61   M             1400 1650 QC 4001  SEM               Y Y  Y   N                3    3  Primary - R Whitaker
ANTH 4071 Soc&Cult Aspct Hlth&Illn    001 90403 13   M   W         1400 1515 ED 3023  LEC               Y Y  Y   N                3    3  Primary - E Tenkorang
                                          CROSS LISTED:    SOCI 4071-001
                                      056 93651 G25  M   W         1730 1845          LEC               Y Y  Y   N                3    3  Primary - E Tenkorang
                                          CROSS LISTED:    SOCI 4071-056
ANTH 4412 Contemp Theory in Anthropol 001 90163 72     T           1500 1750 QC 4028  SEM               Y Y  Y   N                3    3  Primary - A Carbonella
ANTH 4995 Honours Essay II            001 91196 99                                    HES               Y Y  Y   N                3    3

Subject: Biology

BIOL 1001 Principles of Biology       001 64724 05   M   W   F     1200 1250 SN 2109  L&L               Y Y  Y   Y                3    3  Primary - S Goddard
                                                61   M             1400 1650 SN 1087
                                      002 60031 05   M   W   F     1200 1250 SN 2109  L&L               Y Y  Y   Y                3    3  Primary - S Goddard
                                                62     T           1400 1650 SN 1087
                                      003 60033 05   M   W   F     1200 1250 SN 2109  L&L               Y Y  Y   Y                3    3  Primary - S Goddard
                                                63       W         1400 1650 SN 1087
                                      004 64723 05   M   W   F     1200 1250 SN 2109  L&L               Y Y  Y   Y                3    3  Primary - S Goddard
                                                64         R       1400 1650 SN 1087
                                      005 60034 05   M   W   F     1200 1250 SN 2109  L&L               Y Y  Y   Y                3    3  Primary - S Goddard
                                                42     T           0900 1150 SN 1087
BIOL 1002 Principles of Biology       001 60041 02   M   W   F     0900 0950 ED 1020  L&L               Y Y  Y   Y                3    3  Primary - M Caldwell
                                                61   M             1400 1650 SN 1096
                                      002 60044 02   M   W   F     0900 0950 ED 1020  L&L               Y Y  Y   Y                3    3  Primary - M Caldwell
                                                62     T           1400 1650 SN 1096
                                      003 60047 02   M   W   F     0900 0950 ED 1020  L&L               Y Y  Y   Y                3    3  Primary - M Caldwell
                                                63       W         1400 1650 SN 1096
                                      004 60052 02   M   W   F     0900 0950 ED 1020  L&L               Y Y  Y   Y                3    3  Primary - M Caldwell
                                                64         R       1400 1650 SN 1096
                                      005 61946 02   M   W   F     0900 0950 ED 1020  L&L               Y Y  Y   Y                3    3  Primary - M Caldwell
                                                65           F     1400 1650 SN 1096
                                      006 66817 02   M   W   F     0900 0950 ED 1020  L&L               Y Y  Y   Y                3    3  Primary - M Caldwell
                                                42     T           0900 1150 SN 1096
                                      007 60053 08   M   W   F     1500 1550 SN 2109  L&L               Y Y  Y   Y                3    3  Primary - P Trela
                                                42     T           0900 1150 SN 1091
                                      008 63317 08   M   W   F     1500 1550 SN 2109  L&L               Y Y  Y   Y                3    3  Primary - P Trela
                                                43       W         0900 1150 SN 1096
                                      009 63319 08   M   W   F     1500 1550 SN 2109  L&L               Y Y  Y   Y                3    3  Primary - P Trela
                                                44         R       0900 1150 SN 1091
                                      010 63321 08   M   W   F     1500 1550 SN 2109  L&L               Y Y  Y   Y                3    3  Primary - P Trela
                                                62     T           1400 1650 SN 1091
                                      011 64725 08   M   W   F     1500 1550 SN 2109  L&L               Y Y  Y   Y                3    3  Primary - P Trela
                                                64         R       1400 1650 SN 1091
                                      012 66657 02   M   W   F     0900 0950 ED 1020  L&L               Y Y  Y   Y                3    3  Primary - M Caldwell
                                                61   M             1400 1650 SN 1091

Subject: Computer Science

COMP 1000 Comp Science - An Introduct 001 86875 07   M   W   F     1400 1450 EN 2006  L&L               Y Y  Y   N        Q       3    3  Primary - H Wareham
                                                42     T           0900 1150 CS 1019
COMP 1001 Intro to Programming        001 87522 05   M   W   F     1200 1250 EN 2043  L&L               Y Y  Y   N        Q       3    3  Primary - G Miminis
                                                65           F     1400 1650 CS 1019
COMP 1002 Intro to Logic for Comp Sci 001 86879 06   M T   R       1300 1350 EN 2006  L&L               Y Y  Y   N        Q       3    3  Primary - K Nickerson
                                                43       W         0900 1150 CS 1019
                                      002 93748 06   M T   R       1300 1350 EN 2006  L&L               Y Y  Y   N        Q       3    3
                                                44         R       0900 1150 CS 1019
COMP 1003 Foundations of Computing Sy 001 92196 09   M   W   F     1600 1650 EN 2006  L&L               Y Y  Y   Y        Q       3    3  Primary - M Mata-Monter
                                                45           F     0900 1150 CS 1019
COMP 1510 An Intro Prgrm Scientific C 001 90446 04   M   W   F     1100 1150 C  2004  L&L               Y Y  Y   Y        Q       3    3  Primary - S Bungay
                                                64         R       1400 1650 CS 1019
COMP 2001 Obj-Orient Prgm Human Comp  001 88652 18     T   R       1030 1145 EN 1054  L&L               Y Y  Y   Y    Y   Q       3    3  Primary - X Jiang
                                                61   M             1400 1650 CS 1019
                                          RESERVED  FOR: MAJOR  COMP
                                                         MINOR         COMP
COMP 2002 Data Strctrs & Algorithms   001 88655 03   M   W   F     1000 1050 EN 1054  L&L               Y Y  Y   Y    Y   Q       3    3  Primary - X Jiang
                                                63       W         1400 1650 CS 1019
                                          RESERVED  FOR: MAJOR  COMP
                                                         MINOR         COMP
COMP 3100 Web Programming             001 91270 02   M   W   F     0900 0950 EN 1051  LEC               Y Y  Y   Y                3    3  Primary - R Byrne
COMP 3201 Nature-Inspired Computing   001 92198 07   M   W   F     1400 1450 EN 2043  LEC               Y Y  Y   Y        Q       3    3  Primary - M Hatcher
COMP 4820 Modern Cybersecurity/Defenc 056 93095 32       W         1900 2130 EN 2007  LEC               Y Y  Y   Y        Q       3    3  Primary - D Parsons
`;

export const testSemester2: ISemester = {
  year: 2020,
  term: 2,
  level: 1,
};

export const testSemester2Crns = [94400, 92045];

export const testSemester2Sids = [
  createSID(testSemester2, testSemester2Crns[0]),
  createSID(testSemester2, testSemester2Crns[1]),
];

export const testSemester2Data = `
Level: Undergraduate

Campus: Grenfell

Session: Full Term

                                                     *** DAYS ***  BEG  END          SCHED  ASSOC LAB/      WAIT PRE RESV       CRED BILL
                 COURSE               SEC CRN   SLOT M T W R F S U TIME TIME  ROOM   TYPE   LEC SECT   PHON LIST CHK LFTD ATTR   HR   HR  INSTRUCTOR
                 ------               --- ----- ---- ------------- ---- ---- ------- -----  ---------- ---- ---- --- ---- ----- ---- ---- ----------


Subject: Anthropology

ANTH 1031 Introduction to Anthropolog 061 94400      M T           1630 1720          LEC               Y Y  Y   N                3    3  Primary - A Robinson
                                          Course delivered remotely.
ANTH 2300 Newfoundland Folklore       061 95351 99                                    REA               N N  N   Y        W       3    3  Primary - J Bodner
                                          CROSS LISTED:    FOLK 2300-061
                                          Contact Program Chair to register.  Course delivered remotely.
ANTH 2410 Classics in Anthropology    061 94401 G21  M             1330 1445          LEC               Y Y  Y   N                3    3  Primary - A Robinson
                                                G21      W         1230 1345
                                          Course delivered remotely.
ANTH 2415 Anthropology of Food        061 94402 99                                    LEC               Y Y  Y   N                3    3  Primary - K Sawden
                                          Course delivered remotely.


Subject: English

ENGL 1000 Critical Read&Writ Prose Fo 061 94445 G06  M T   R       1630 1720          LEC               Y Y  Y   N        W       3    3  Primary - M Jacobsen
                                          Course delivered remotely.
                                      062 95350 G08    T   R F     1330 1420          LEC               Y Y  Y   N        W       3    3  Primary - M Jacobsen
                                          Course delivered remotely.
ENGL 2007 Lit Survey III(1837-Pres)   061 94456 G05  M             1230 1320          LEC               Y Y  Y   Y    Y   G W     3    3  Primary - T Halford
                                                G05    T     F     1130 1220
                                          RESERVED  FOR: MAJOR  ENLG
                                                         MINOR         ENLG
                                          Course delivered remotely.
ENGL 2156 Canadian Short Stories      061 94989 G21  M             1330 1445          LEC               Y Y  Y   Y    Y   W       3    3  Primary - S Ganz
                                                G21      W         1230 1345
                                          RESERVED  FOR: MAJOR  ENLG
                                                         MINOR         ENLG
                                          Not all spaces have been reserved for ENLG major & minor; other students may register.  Course delivered remotely.
ENGL 2215 American Lit To 1900        061 94458 G03  M   W   F     1030 1120          LEC               Y Y  Y   Y    Y   W       3    3  Primary - A Beardsworth
                                          RESERVED  FOR: MAJOR  ENLG
                                                         MINOR         ENLG
                                          Not all spaces have been reserved for ENLG major & minor; other students may register.  Course delivered remotely.

Campus: Online

Session: Full Term

                                                     *** DAYS ***  BEG  END          SCHED  ASSOC LAB/      WAIT PRE RESV       CRED BILL
                 COURSE               SEC CRN   SLOT M T W R F S U TIME TIME  ROOM   TYPE   LEC SECT   PHON LIST CHK LFTD ATTR   HR   HR  INSTRUCTOR
                 ------               --- ----- ---- ------------- ---- ---- ------- -----  ---------- ---- ---- --- ---- ----- ---- ---- ----------

Subject: Chemistry

CHEM 1810 Elements of Chemistry       081 92045 99                                    WWW               Y Y  Y   Y        Q       3    3  Primary - G Rayner-Canh D Wheeler
CHEM 3261 Atmospheric Chemistry       081 94349 99                                    WWW               Y Y  Y   Y        Q       3    3  Primary - G Rayner-Canh
                                          CROSS LISTED:    ENVS 3261-081


Subject: Computer Science

COMP 1001 Intro to Programming        081 88648 99                                    WWW               Y Y  Y   N        Q       3    3  Primary - R Gupta
                                          Midterm and final exams will be administered online.
COMP 1600 Basic Computing & Info Tech 081 77335 99                                    WWW               Y Y  N   N        Q       3    3  Primary - R Gupta
                                          Midterm and final exams will be administered online.
`;
