import React, { useState, useMemo } from "react";

import { ISemester } from "../../../backend/models/semester";
import parseData from "../../../backend/scrape/banner/parse-data";

function BannerTest() {
  const [year] = useState(2020);
  const [term] = useState(2);
  const [level] = useState(1);

  const [data, setData] = useState("");
  const [error, setError] = useState<Error | null>(null);

  const output = useMemo(() => {
    const testSemester: ISemester = {
      year: year,
      term: term,
      level: level,
    };

    try {
      const freshData = parseData(testSemester, data.split("\n"));
      setError(null);
      return JSON.stringify(freshData, null, 2);
    } catch (err) {
      setError(err);
    }
  }, [year, term, level, data]);

  const handleChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    setData(event.target.value);
  };

  return (
    <div className="banner-test-root">
      <h1>Input</h1>
      <textarea value={data} onChange={handleChange} />
      <br />
      <h1>Output</h1>
      <div className="banner-test-output">
        <pre>{error ? error.message : output}</pre>
      </div>
    </div>
  );
}

export default BannerTest;
