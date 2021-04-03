import React, { useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import Select, { OptionTypeBase, StylesConfig } from "react-select";

import { IPossibleFilters } from "../../../../backend/api/controllers/courses";
import { useStoreActions, useStoreState } from "../../store";
import { ICourseFilters } from "../../store/courses";
import Box from "../Box";
import { levelToName, termToName } from "../Course";

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

export const customSelectStyles: StylesConfig<OptionTypeBase, false> = {
  control: (provided) => ({
    ...provided,
    borderColor: "#e5e7eb",
    borderRadius: 0,
    ":hover": {
      borderColor: "inherit",
    },
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#9ca3af",
  }),
};

export const usePossibleCourseFilterOptions = (
  possibleCourseFilters?: IPossibleFilters
) =>
  useMemo(() => {
    if (possibleCourseFilters === undefined) {
      return { years: [], terms: [], levels: [], subjects: [] };
    }

    return {
      years: possibleCourseFilters.years
        .map((year) => yearToOption(year))
        .reverse(),
      terms: possibleCourseFilters.terms.map((term) => termToOption(term)),
      levels: possibleCourseFilters.levels.map((level) => levelToOption(level)),
      subjects: possibleCourseFilters.subjects.map((subject) =>
        subjectToOption(subject)
      ),
    };
  }, [possibleCourseFilters]);

function SetFilters({ defaults }: { defaults: ICourseFilters }) {
  const { control, register, handleSubmit } = useForm<ICourseFilters>();

  const filters = useStoreState((state) => state.courseFilters);
  const possibleCourseFilters = useStoreState(
    (state) => state.possibleCourseFilters
  );
  const setCourseFilters = useStoreActions(
    (actions) => actions.setCourseFilters
  );

  const options = usePossibleCourseFilterOptions(possibleCourseFilters);

  const onSubmit = (data: ICourseFilters) => {
    setCourseFilters({
      page: 0,
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

  if (filters === undefined) {
    return null;
  }

  return (
    <Box>
      <form className="p-5 mb-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-2">
          <Controller
            name="semesterYear"
            control={control}
            defaultValue={defaults.semesterYear ?? NaN}
            render={(props) => (
              <Select
                className="inline-block w-1/3 pr-2"
                styles={customSelectStyles}
                placeholder="Semester Year"
                isClearable
                defaultValue={
                  defaults.semesterYear
                    ? yearToOption(defaults.semesterYear)
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
            defaultValue={defaults.semesterTerm ?? NaN}
            render={(props) => (
              <Select
                className="inline-block w-1/3"
                styles={customSelectStyles}
                placeholder="Semester Term"
                isClearable
                defaultValue={
                  defaults.semesterTerm
                    ? termToOption(defaults.semesterTerm)
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
            defaultValue={defaults.semesterLevel ?? NaN}
            render={(props) => (
              <Select
                className="inline-block w-1/3 pl-2"
                styles={customSelectStyles}
                placeholder="Semester Level"
                isClearable
                defaultValue={
                  defaults.semesterLevel
                    ? levelToOption(defaults.semesterLevel)
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
          defaultValue={defaults.subject ?? ""}
          render={(props) => (
            <Select
              styles={customSelectStyles}
              isClearable
              placeholder="Course Subject"
              defaultValue={
                defaults.subject ? subjectToOption(defaults.subject) : undefined
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
          defaultValue={defaults.number ?? ""}
          ref={register}
        />
        <input
          className="w-full py-0.5 mt-4 border bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-200"
          type="submit"
          value="Submit"
        />
      </form>
    </Box>
  );
}

export default SetFilters;
