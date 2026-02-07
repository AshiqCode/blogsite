import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../pages/user/Home";
import PostDetails from "../pages/user/PostDetails";

import AdminLayout from "../pages/admin/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminNewPost from "../pages/admin/AdminNewPost";
import AdminEditPost from "../pages/admin/AdminEditPost";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/post/:slug" element={<PostDetails />} />

      <Route path="/blogadmincode4" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="new" element={<AdminNewPost />} />
        <Route path="edit/:id" element={<AdminEditPost />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
