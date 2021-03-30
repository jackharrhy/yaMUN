import React from "react";

import { COURSE_SEARCH_PAGINATION_LIMIT } from "../../../backend/api/controllers/courses";

type PaginationProps = {
  page: number;
  results?: number;
  nextPage: () => void;
  previousPage: () => void;
  isFooter?: boolean;
};

function Pagination({
  page,
  results,
  nextPage,
  previousPage,
  isFooter = false,
}: PaginationProps) {
  const userPage = page + 1;

  const lacksResults = results === 0 || results === undefined;
  const hide = lacksResults && page !== 0 && !isFooter;
  if (hide) return null;

  const nextDisabled = results !== COURSE_SEARCH_PAGINATION_LIMIT;
  const backDisabled = page <= 0;

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
