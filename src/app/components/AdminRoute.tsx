import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export function AdminRoute() {
  const userStr = localStorage.getItem("user");

  // 1. Kiểm tra xem đã đăng nhập chưa
  if (!userStr) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(userStr);
    // 2. Kiểm tra xem Role có phải là ADMIN không
    if (user.role !== "ADMIN") {
      return <Navigate to="/" replace />;
    }
  } catch (error) {
    return <Navigate to="/login" replace />;
  }

  // 3. Nếu đúng là ADMIN thì cho phép truy cập các route con bên trong
  return <Outlet />;
}