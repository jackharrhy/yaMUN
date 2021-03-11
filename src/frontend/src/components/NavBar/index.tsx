import React from "react";
import { Link } from "react-router-dom";

function NavBar() {
  return (
    <nav className="flex items-center pl-3.5 shadow-md bg-red-500">
      <div className="pr-10">
        <Link
          to="/"
          className="text-3xl py-2 leading-6 text-white font-bold hover:text-gray-200 focus:outline-none border-b-2 border-transparent focus:border-red-900"
        >
          yaMUN
        </Link>
      </div>
      <ul className="flex items-center justify-between text-base">
        <li>
          <Link
            to="/find-courses"
            className="mr-6 p-4 py-3 px-0 block font-semibold text-white hover:text-gray-200 focus:outline-none border-b-2 border-transparent focus:border-red-900"
          >
            Find Courses
          </Link>
        </li>
        <li>
          <Link
            to="/schedules"
            className="mr-6 p-4 py-3 px-0 block font-semibold text-white hover:text-gray-200 focus:outline-none border-b-2 border-transparent focus:border-red-900"
          >
            Schedules
          </Link>
        </li>
        <li>
          <Link
            to="/bookmarks"
            className="mr-6 p-4 py-3 px-0 block font-semibold text-white hover:text-gray-200 focus:outline-none border-b-2 border-transparent focus:border-red-900"
          >
            Bookmarks
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
