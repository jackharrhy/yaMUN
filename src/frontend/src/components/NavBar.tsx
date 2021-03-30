import React from "react";
import { Link } from "react-router-dom";

import Logo from "./Logo";

function Option({ link, text }: { link: string; text: string }) {
  return (
    <li>
      <Link
        to={link}
        className="mr-6 p-4 py-3 px-0 block font-semibold text-white hover:text-gray-200 focus:outline-none border-b-2 border-transparent focus:border-red-900"
      >
        {text}
      </Link>
    </li>
  );
}

function NavBar() {
  return (
    <nav className="flex items-center pl-3.5 shadow-md bg-red-500">
      <div className="pr-10">
        <Link
          style={{ fontSize: "0.7rem" }}
          to="/"
          className="py-2 leading-6 text-white font-bold hover:text-gray-200 focus:outline-none border-b-2 border-transparent focus:border-red-900"
        >
          <Logo />
        </Link>
      </div>
      <ul className="flex items-center justify-between text-base">
        <Option link="/find-courses" text="Find Courses" />
        <Option link="/schedules" text="Schedules" />
        <Option link="/bookmarks" text="Bookmarks" />
        <Option link="/login" text="Login" />
      </ul>
    </nav>
  );
}

export default NavBar;
