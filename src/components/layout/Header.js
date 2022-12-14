import React from "react";
import { NavLink } from "react-router-dom";

const Header = () => {
  return (
    <header
      className="header flex fixed top-0 w-full z-10 bg-black left-0
     items-center justify-center gap-x-5 text-white py-10 mb-5"
    >
      <NavLink
        to="/"
        className={({ isActive }) =>
          isActive ? "text-primary text-xl" : "text-xl"
        }
      >
        Home
      </NavLink>
      <NavLink
        to="./movies"
        className={({ isActive }) =>
          isActive ? "text-primary text-xl" : "text-xl"
        }
      >
        Movies
      </NavLink>
    </header>
  );
};

export default Header;
