import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { IScheduleDocument } from "../../../../../backend/models/schedule";
import Box from "../../Box";

type ExportFormInputs = {
  startYear: number;
  startMonth: number;
  startDay: number;
  endYear: number;
  endMonth: number;
  endDay: number;
};

function downloadUri(uri: string, name: string) {
  const link = document.createElement("a");
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  link.remove();
}

function Export({ schedule }: { schedule: IScheduleDocument }) {
  const { register, handleSubmit } = useForm<ExportFormInputs>();

  const onSubmit: SubmitHandler<ExportFormInputs> = ({
    startYear,
    startMonth,
    startDay,
    endYear,
    endMonth,
    endDay,
  }) => {
    const params = new URLSearchParams({
      startYear: startYear.toString(),
      startMonth: startMonth.toString(),
      startDay: startDay.toString(),
      endYear: endYear.toString(),
      endMonth: endMonth.toString(),
      endDay: endDay.toString(),
    });

    const uri = `/api/export/schedules/${schedule._id}/ics?${params}`;
    console.log(uri);
    downloadUri(uri, `${schedule.title}.ics`);
  };

  return (
    <div className="mb-8 pt">
      <Box className="py-4 px-5">
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="number"
            name="startYear"
            placeholder="Starting Year"
            ref={register({ valueAsNumber: true, required: true })}
            className="w-full px-3 py-1 border mt-2 focus:outline-none focus:ring-2 focus:ring-red-200"
          />
          <input
            type="number"
            name="startMonth"
            placeholder="Starting Month"
            ref={register({ valueAsNumber: true, required: true })}
            className="w-full px-3 py-1 border mt-2 focus:outline-none focus:ring-2 focus:ring-red-200"
          />
          <input
            type="number"
            name="startDay"
            placeholder="Starting Day"
            ref={register({ valueAsNumber: true, required: true })}
            className="w-full px-3 py-1 border mt-2 focus:outline-none focus:ring-2 focus:ring-red-200"
          />
          <input
            type="number"
            name="endYear"
            placeholder="Ending Year"
            ref={register({ valueAsNumber: true, required: true })}
            className="w-full px-3 py-1 border mt-2 focus:outline-none focus:ring-2 focus:ring-red-200"
          />
          <input
            type="number"
            name="endMonth"
            placeholder="Ending Month"
            ref={register({ valueAsNumber: true, required: true })}
            className="w-full px-3 py-1 border mt-2 focus:outline-none focus:ring-2 focus:ring-red-200"
          />
          <input
            type="number"
            name="endDay"
            placeholder="Ending Day"
            ref={register({ valueAsNumber: true, required: true })}
            className="w-full px-3 py-1 border mt-2 focus:outline-none focus:ring-2 focus:ring-red-200"
          />
          <input
            type="submit"
            value="Export"
            className="w-full py-0.5 mt-4 border bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-200"
          />
        </form>
      </Box>
    </div>
  );
}

export default Export;
