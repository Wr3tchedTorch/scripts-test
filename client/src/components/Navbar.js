// Navbar.js
import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul>
        <li>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            Usuários
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/produtos"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            Produtos
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
