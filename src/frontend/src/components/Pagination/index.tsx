import React from "react";

import { COURSE_SEARCH_PAGINATION_LIMIT } from "../../../../backend/api/controllers/courses";

type PaginationProps = {
  page: number;
  results: number;
  nextPage: () => void;
  previousPage: () => void;
};

function Pagination({
  page,
  results,
  nextPage,
  previousPage,
}: PaginationProps) {
  const userPage = page + 1;

  const backDisabled = page <= 0;
  const nextDisabled = results !== COURSE_SEARCH_PAGINATION_LIMIT;

  if ((backDisabled && nextDisabled) || results === 0) {
    return null;
  }

  return (
    <div className="flex place-content-between my-4">
      <button
        className={
          "border px-2 py-1 rounded-md w-32 disabled:opacity-50 disabled:cursor-not-allowed"
        }
        disabled={backDisabled}
        onClick={() => previousPage()}
      >
        Previous
      </button>
      <p className="text-lg text-center font-medium mt-1">Page {userPage}</p>
      <button
        className={
          "border px-2 py-1 rounded-md w-32 disabled:opacity-50 disabled:cursor-not-allowed"
        }
        disabled={nextDisabled}
        onClick={() => nextPage()}
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;
