import React from "react";
import { useForm } from "react-hook-form";

import { Filters } from "../../hooks/useCourseSearch";

interface SetFiltersProps {
  filters: Filters;
  setFilters: (data: Filters) => void;
}

function SetFilters({ filters, setFilters }: SetFiltersProps) {
  const { register, handleSubmit } = useForm<Filters>();

  const onSubmit = (data: Filters) => {
    console.log("data", data);
    setFilters({
      page: undefined,
      subject: data.subject === "" ? undefined : data.subject,
      number: data.number === "" ? undefined : data.number,
      semesterYear: Number.isNaN(data.semesterYear)
        ? undefined
        : data.semesterYear,
      semesterTerm: Number.isNaN(data.semesterTerm)
        ? undefined
        : data.semesterTerm,
      semesterLevel: Number.isNaN(data.semesterLevel)
        ? undefined
        : data.semesterLevel,
    });
  };

  return (
    <form
      className="shadow-md p-5 mb-4 rounded border"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="mb-2">
        <input
          className="pl-3 py-1 w-1/3 border-box border focus:outline-none focus:ring-2 focus:ring-red-200"
          type="number"
          name="semesterYear"
          placeholder="Semester Year"
          defaultValue={filters.semesterYear} // get current year
          ref={register({ valueAsNumber: true })}
        />
        <input
          className="pl-3 py-1 w-1/3 border-box border focus:outline-none focus:ring-2 focus:ring-red-200"
          type="number"
          name="semesterTerm"
          placeholder="Semester Term"
          defaultValue={filters.semesterTerm} // get current year
          ref={register({ valueAsNumber: true })}
        />
        <input
          className="pl-3 py-1 w-1/3 border-box border focus:outline-none focus:ring-2 focus:ring-red-200"
          type="number"
          name="semesterLevel"
          placeholder="Semester Level"
          defaultValue={filters.semesterLevel} // get current year
          ref={register({ valueAsNumber: true })}
        />
      </div>
      <input
        className="w-full px-3 py-1 border focus:outline-none focus:ring-2 focus:ring-red-200"
        name="subject"
        placeholder="Subject"
        defaultValue={filters.subject ?? ""}
        ref={register}
      />
      <input
        className="w-full px-3 py-1 border mt-2 focus:outline-none focus:ring-2 focus:ring-red-200"
        name="number"
        placeholder="Course Number"
        defaultValue={filters.number ?? ""}
        ref={register}
      />
      <input
        className="w-full py-0.5 mt-4 border bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-200"
        type="submit"
      />
    </form>
  );
}

export default SetFilters;
