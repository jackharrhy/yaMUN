import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import Select from "react-select";

import { ISemester } from "../../../../backend/models/semester";
import { useStoreActions, useStoreState } from "../../store";
import Box from "../Box";
import {
  customSelectStyles,
  usePossibleCourseFilterOptions,
} from "../FindCourses/SetFilters";

type CreateFormInputs = {
  title: string;
  description: string;
  isPublic: boolean;
  semesterYear: number;
  semesterTerm: number;
  semesterLevel: number;
};

function Create() {
  const createSchedule = useStoreActions((actions) => actions.createSchedule);

  const possibleCourseFilters = useStoreState(
    (state) => state.possibleCourseFilters
  );

  const options = usePossibleCourseFilterOptions(possibleCourseFilters);

  const { control, register, handleSubmit } = useForm<CreateFormInputs>();

  const onSubmit: SubmitHandler<CreateFormInputs> = ({
    title,
    description,
    isPublic,
    semesterYear,
    semesterTerm,
    semesterLevel,
  }) => {
    const semester: ISemester = {
      year: semesterYear,
      term: semesterTerm,
      level: semesterLevel,
    };
    createSchedule({ title, description, isPublic, semester });
  };

  return (
    <div className="m-auto w-full pt">
      <Link to="/schedules">
        <p className="text-sm text-center mt-1 mb-3">Back to Schedules</p>
      </Link>

      <Box className="py-4 px-5">
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="text"
            name="title"
            placeholder="Title"
            ref={register({ required: true })}
            className="w-full px-3 py-1 border mt-2 focus:outline-none focus:ring-2 focus:ring-red-200"
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            ref={register({ required: false })}
            className="w-full px-3 py-1 border mt-2 focus:outline-none focus:ring-2 focus:ring-red-200"
          />
          <div className="mt-2">
            <Controller
              name="semesterYear"
              control={control}
              render={(props) => (
                <Select
                  className="inline-block w-1/3 pr-2"
                  styles={customSelectStyles}
                  placeholder="Semester Year"
                  isClearable
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
                  styles={customSelectStyles}
                  placeholder="Semester Term"
                  isClearable
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
                  styles={customSelectStyles}
                  placeholder="Semester Level"
                  isClearable
                  onChange={(e) => props.onChange(e?.value)}
                  options={options.levels}
                />
              )}
            />
          </div>
          <input
            type="checkbox"
            name="isPublic"
            ref={register}
            className="px-3 py-1 border mt-3 mx-2 focus:outline-none focus:ring-2 focus:ring-red-200"
          />
          <label htmlFor="isPublic">Is Public</label>
          <input
            type="submit"
            value="Create Schedule"
            className="w-full py-0.5 mt-4 border bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-200"
          />
        </form>
      </Box>
    </div>
  );
}

export default Create;
