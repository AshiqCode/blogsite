import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import NoIndex from "../../components/NoIndex";

export default function AdminLayout() {
  return (
    <div className="admin-shell">
      {/* 🚫 Prevent search engines from indexing admin pages */}
      <NoIndex />

      <aside className="admin-sidebar">
        <div className="admin-title">Admin Panel</div>

        <nav className="admin-nav">
          <NavLink
            to="/blogadmincode4"
            end
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/blogadmincode4/new"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Create Post
          </NavLink>

          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            View Site
          </NavLink>
        </nav>
      </aside>

      <section className="admin-content">
        <Outlet />
      </section>
    </div>
  );
}
