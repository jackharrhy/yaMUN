import React, { useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";

import useCoursePossibleFilters from "../../hooks/useCoursePossibleFilters";
import { Filters } from "../../hooks/useCourseSearch";
import { levelToName, termToName } from "../Course";

interface SetFiltersProps {
  filters: Filters;
  setFilters: (data: Filters) => void;
}

const yearToOption = (semesterYear: number) => ({
  value: semesterYear,
  label: semesterYear,
});

const termToOption = (semesterTerm: number) => ({
  value: semesterTerm,
  label: termToName[semesterTerm - 1],
});

const levelToOption = (semesterLevel: number) => ({
  value: semesterLevel,
  label: levelToName[semesterLevel - 1],
});

const subjectToOption = (subject: string) => ({
  value: subject,
  label: subject,
});

function SetFilters({ filters, setFilters }: SetFiltersProps) {
  const { control, register, handleSubmit } = useForm<Filters>();

  const { possibleFilters, error } = useCoursePossibleFilters();

  const options = useMemo(() => {
    if (possibleFilters === null) {
      return { years: [], terms: [], levels: [], subjects: [] };
    }

    return {
      years: possibleFilters.years.map((year) => yearToOption(year)).reverse(),
      terms: possibleFilters.terms.map((term) => termToOption(term)),
      levels: possibleFilters.levels.map((level) => levelToOption(level)),
      subjects: possibleFilters.subjects.map((subject) =>
        subjectToOption(subject)
      ),
    };
  }, [possibleFilters]);

  if (error) {
    // TODO display nice error instead of just hiding the search view
    return null;
  }

  const onSubmit = (data: Filters) => {
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
        <Controller
          name="semesterYear"
          control={control}
          defaultValue={filters.semesterYear}
          render={(props) => (
            <Select
              className="inline-block w-1/3 pr-2"
              placeholder="Semester Year"
              isClearable
              defaultValue={
                filters.semesterYear
                  ? yearToOption(filters.semesterYear)
                  : undefined
              }
              onChange={(e) => props.onChange(e?.value)}
              options={options.years}
            />
          )}
        />
        <Controller
          name="semesterTerm"
          control={control}
          render={(props) => (
            <Select
              className="inline-block w-1/3"
              placeholder="Semester Term"
              isClearable
              defaultValue={
                filters.semesterTerm
                  ? termToOption(filters.semesterTerm)
                  : undefined
              }
              onChange={(e) => props.onChange(e?.value)}
              options={options.terms}
            />
          )}
        />
        <Controller
          name="semesterLevel"
          control={control}
          render={(props) => (
            <Select
              className="inline-block w-1/3 pl-2"
              placeholder="Semester Level"
              isClearable
              defaultValue={
                filters.semesterLevel
                  ? levelToOption(filters.semesterLevel)
                  : undefined
              }
              onChange={(e) => props.onChange(e?.value)}
              options={options.levels}
            />
          )}
        />
      </div>
      <Controller
        name="subject"
        control={control}
        defaultValue={filters.subject ?? ""}
        render={(props) => (
          <Select
            isClearable
            placeholder="Course Subject"
            defaultValue={
              filters.subject ? subjectToOption(filters.subject) : undefined
            }
            onChange={(e) => props.onChange(e?.value)}
            options={options.subjects}
          />
        )}
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
